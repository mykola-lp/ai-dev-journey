from __future__ import annotations

from dataclasses import dataclass, field

from ant_mind.types import Action, Body


@dataclass
class FoodSite:
    x: int
    y: int
    amount: int = 3


@dataclass
class ThreatSource:
    x: int
    y: int
    intensity: float = 0.0


@dataclass
class Relative:
    dx: int
    dy: int
    distance: int
    intensity: float = 0.0
    strength: float = 0.0


@dataclass
class World:
    width: int = 11
    height: int = 11
    nest_x: int = 5
    nest_y: int = 5
    scent_range: float = 8.0
    foods: list[FoodSite] = field(default_factory=list)
    threat: ThreatSource | None = None
    obstacles: set[tuple[int, int]] = field(default_factory=set)
    pheromone: dict[tuple[int, int], float] = field(default_factory=dict)

    @classmethod
    def default(cls) -> World:
        world = cls()
        world.foods = [FoodSite(9, 2, amount=4)]
        world.obstacles = {(7, 3), (7, 4)}
        for x in range(5, 10):
            world.pheromone[(x, 5)] = 0.2 + (x - 5) * 0.08
        world.pheromone[(9, 4)] = 0.55
        world.pheromone[(9, 3)] = 0.65
        world.pheromone[(9, 2)] = 0.8
        return world

    def in_bounds(self, x: int, y: int) -> bool:
        return 0 <= x < self.width and 0 <= y < self.height

    def can_move(self, x: int, y: int) -> bool:
        return self.in_bounds(x, y) and (x, y) not in self.obstacles

    def nearest_food(self, x: int, y: int) -> Relative | None:
        best: Relative | None = None
        for food in self.foods:
            if food.amount <= 0:
                continue
            dist = abs(food.x - x) + abs(food.y - y)
            rel = Relative(dx=food.x - x, dy=food.y - y, distance=dist)
            if best is None or dist < best.distance:
                best = rel
        return best

    def threat_at(self, x: int, y: int) -> Relative:
        if self.threat is None or self.threat.intensity <= 0:
            return Relative(0, 0, 99, intensity=0.0)
        dx, dy = self.threat.x - x, self.threat.y - y
        dist = abs(dx) + abs(dy)
        falloff = max(0.0, 1.0 - dist / 6.0)
        return Relative(dx, dy, dist, intensity=self.threat.intensity * falloff)

    def pheromone_at(self, x: int, y: int) -> Relative:
        here = self.pheromone.get((x, y), 0.0)
        best_dir = (0, 0)
        best = -1.0
        for dx, dy in ((0, -1), (0, 1), (1, 0), (-1, 0)):
            nx, ny = x + dx, y + dy
            if not self.in_bounds(nx, ny) or (nx, ny) in self.obstacles:
                continue
            value = self.pheromone.get((nx, ny), 0.0)
            if value > best:
                best = value
                best_dir = (dx, dy)
        if best <= 0:
            best_dir = (0, 0)
            best = 0.0
        return Relative(best_dir[0], best_dir[1], 0, strength=max(here, best * 0.8))

    def blocked_ahead(self, body: Body) -> bool:
        nx, ny = body.x + body.heading[0], body.y + body.heading[1]
        return (nx, ny) in self.obstacles or not self.in_bounds(nx, ny)

    def inject_threat(self, x: int, y: int, intensity: float = 1.0) -> None:
        self.threat = ThreatSource(x=x, y=y, intensity=intensity)

    def clear_threat(self) -> None:
        self.threat = None

    def apply(self, body: Body, action: Action) -> None:
        if action.name == "pick_up":
            self._try_pick(body)
        elif action.name == "drop":
            if body.carrying_food and body.x == self.nest_x and body.y == self.nest_y:
                body.carrying_food = False
                body.hunger = max(0.15, body.hunger - 0.25)
                body.energy = min(1.0, body.energy + 0.2)
        else:
            nx, ny = body.x + action.dx, body.y + action.dy
            if (action.dx or action.dy) and self.can_move(nx, ny):
                body.x, body.y = nx, ny
                body.heading = (action.dx, action.dy)
                if body.carrying_food:
                    trail = self.pheromone.get((body.x, body.y), 0.0)
                    self.pheromone[(body.x, body.y)] = min(1.0, trail + 0.08)

        body.energy = max(0.05, body.energy - 0.015)
        if not body.carrying_food:
            body.hunger = min(1.0, body.hunger + 0.012)

        food = self.nearest_food(body.x, body.y)
        if food is not None and food.distance == 0 and not body.carrying_food:
            self._try_pick(body)

    def _try_pick(self, body: Body) -> None:
        for food in self.foods:
            if food.x == body.x and food.y == body.y and food.amount > 0:
                food.amount -= 1
                body.carrying_food = True
                break
