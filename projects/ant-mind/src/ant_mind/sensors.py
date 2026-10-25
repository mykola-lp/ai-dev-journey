from __future__ import annotations

from ant_mind.types import Body, Percepts
from ant_mind.world import World


def _unit(dx: int, dy: int) -> tuple[int, int]:
    if dx == 0 and dy == 0:
        return (0, 0)
    if abs(dx) >= abs(dy):
        return (1 if dx > 0 else -1, 0)
    return (0, 1 if dy > 0 else -1)


def sense(world: World, body: Body) -> Percepts:
    food = world.nearest_food(body.x, body.y)
    threat = world.threat_at(body.x, body.y)
    nest_dx, nest_dy = world.nest_x - body.x, world.nest_y - body.y
    nest_dist = abs(nest_dx) + abs(nest_dy)
    food_dx = food.dx if food else 0
    food_dy = food.dy if food else 0
    food_dist = food.distance if food else 99
    pher = world.pheromone_at(body.x, body.y)
    blocked = 1.0 if world.blocked_ahead(body) else 0.0

    food_scent = 0.0 if food is None else max(0.0, 1.0 - food_dist / world.scent_range)
    nest_scent = max(0.0, 1.0 - nest_dist / world.scent_range)
    vision_food = 1.0 if food is not None and food_dist <= 2 else 0.0
    vision_threat = 1.0 if threat.intensity > 0 and threat.distance <= 2 else 0.0

    return Percepts(
        food_scent=food_scent,
        pheromone=pher.strength,
        threat=threat.intensity,
        nest_scent=nest_scent,
        touch=blocked,
        vision_food=vision_food,
        vision_threat=vision_threat,
        energy=body.energy,
        hunger=body.hunger,
        nest_distance=float(nest_dist),
        carrying_food=body.carrying_food,
        heading=body.heading,
        position=(body.x, body.y),
        food_dir=_unit(food_dx, food_dy),
        nest_dir=_unit(nest_dx, nest_dy),
        threat_dir=_unit(threat.dx, threat.dy),
        pheromone_dir=_unit(pher.dx, pher.dy),
    )
