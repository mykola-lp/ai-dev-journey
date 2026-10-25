from __future__ import annotations

from ant_mind.types import Action, Percepts, Report, SelfModel, WorkspaceContent

def make_report(
    tick: int,
    workspace: WorkspaceContent,
    action: Action,
    percepts: Percepts,
    self_model: SelfModel,
) -> Report:
    winner = workspace.winner
    focus = "empty" if winner is None else f"{winner.source}: {winner.content}"
    carrying = "carrying food" if self_model.carrying_food else "not carrying food"
    text = (
        f"Tick {tick}. Workspace: {focus}. "
        f"Action: {action.name} ({action.reason}). "
        f"Self: energy {self_model.energy:.2f}, {carrying}."
    )
    return Report(
        tick=tick,
        workspace=workspace.broadcast,
        action=action.name,
        self_summary=self_model.summary(),
        text=text,
        coalitions=[
            {
                "source": c.source,
                "salience": round(c.salience, 3),
                "content": c.content,
                "suggested_action": c.suggested_action,
            }
            for c in workspace.coalitions
        ],
        drives={
            "energy": round(percepts.energy, 3),
            "hunger": round(percepts.hunger, 3),
            "food_scent": round(percepts.food_scent, 3),
            "pheromone": round(percepts.pheromone, 3),
            "threat": round(percepts.threat, 3),
            "nest_scent": round(percepts.nest_scent, 3),
            "touch": round(percepts.touch, 3),
        },
    )
