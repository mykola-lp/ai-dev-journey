from __future__ import annotations

from ant_mind.types import Coalition, Percepts, SelfModel, WorkspaceContent


class NestModule:
    name = "nest"

    def propose(
        self,
        percepts: Percepts,
        workspace: WorkspaceContent,
        self_model: SelfModel,
    ) -> Coalition | None:
        del workspace
        if percepts.carrying_food and percepts.nest_distance == 0:
            return Coalition(
                source=self.name,
                salience=1.4,
                content="at nest with food; drop",
                suggested_action="drop",
            )
        if percepts.carrying_food:
            return Coalition(
                source=self.name,
                salience=0.9 + 0.05 * (8.0 - min(percepts.nest_distance, 8.0)),
                content="carrying food; return to nest",
                suggested_action="go_nest",
                payload={"dir": percepts.nest_dir or self_model.nest_vector},
            )
        if percepts.energy < 0.3:
            return Coalition(
                source=self.name,
                salience=0.7,
                content="low energy; seek nest",
                suggested_action="go_nest",
                payload={"dir": percepts.nest_dir},
            )
        if percepts.nest_scent > 0.7 and not percepts.carrying_food:
            return Coalition(
                source=self.name,
                salience=0.12,
                content="near nest; still foraging",
                suggested_action="idle",
            )
        return None
