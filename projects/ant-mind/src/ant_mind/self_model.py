from __future__ import annotations

from ant_mind.types import Action, Body, SelfModel


def update_self(model: SelfModel, body: Body, action: Action) -> SelfModel:
    nx, ny = model.nest_vector
    model.energy = body.energy
    model.last_action = action.name
    model.carrying_food = body.carrying_food
    model.nest_vector = (nx - action.dx, ny - action.dy)
    return model
