from __future__ import annotations

from collections.abc import Callable

from ant_mind.types import Action, Coalition, Percepts, SelfModel, WorkspaceContent

_DIR_NAME = {
    (0, -1): "north",
    (0, 1): "south",
    (1, 0): "east",
    (-1, 0): "west",
}

NEIGHBORS = ((0, -1), (1, 0), (0, 1), (-1, 0))


def _move(dx: int, dy: int, reason: str) -> Action:
    if dx != 0:
        dx = 1 if dx > 0 else -1
        dy = 0
    elif dy != 0:
        dy = 1 if dy > 0 else -1
        dx = 0
    name = f"move_{_DIR_NAME.get((dx, dy), 'idle')}" if (dx or dy) else "idle"
    return Action(name=name, dx=dx, dy=dy, reason=reason)


def select_action(
    workspace: WorkspaceContent,
    percepts: Percepts,
    self_model: SelfModel,
    can_move: Callable[[int, int], bool] | None = None,
) -> Action:
    winner = workspace.winner
    if winner is None:
        return Action(name="idle", reason="empty workspace")

    name = winner.suggested_action
    if name == "pick_up":
        return Action(name="pick_up", reason=winner.content)
    if name == "drop":
        return Action(name="drop", reason=winner.content)
    if name == "idle":
        return Action(name="idle", reason=winner.content)

    direction = _direction_for(winner, percepts, self_model)
    action = _move(direction[0], direction[1], winner.content)
    if can_move is None or action.dx == 0 and action.dy == 0:
        return action
    nx, ny = percepts.position[0] + action.dx, percepts.position[1] + action.dy
    if can_move(nx, ny):
        return action
    x, y = percepts.position
    nvx, nvy = self_model.nest_vector
    options: list[tuple[int, int, int]] = []
    for dx, dy in NEIGHBORS:
        if can_move(x + dx, y + dy):
            remaining = abs(nvx - dx) + abs(nvy - dy)
            options.append((remaining, dx, dy))
    if not options:
        return Action(name="idle", reason=winner.content + "; blocked")
    options.sort()
    _, dx, dy = options[0]
    return _move(dx, dy, winner.content + "; detour")


def _direction_for(
    winner: Coalition,
    percepts: Percepts,
    self_model: SelfModel,
) -> tuple[int, int]:
    payload_dir = winner.payload.get("dir")
    if isinstance(payload_dir, tuple) and len(payload_dir) == 2:
        return int(payload_dir[0]), int(payload_dir[1])

    if winner.suggested_action == "flee":
        dx, dy = percepts.threat_dir
        return -dx, -dy
    if winner.suggested_action == "follow_pheromone":
        if percepts.pheromone_dir != (0, 0):
            return percepts.pheromone_dir
        return percepts.food_dir
    if winner.suggested_action == "go_nest":
        if percepts.nest_dir != (0, 0):
            return percepts.nest_dir
        return self_model.nest_vector
    if winner.suggested_action == "go_food":
        return percepts.food_dir
    return percepts.heading
