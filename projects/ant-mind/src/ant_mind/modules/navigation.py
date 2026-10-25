from __future__ import annotations

from ant_mind.types import Coalition, Percepts, SelfModel, WorkspaceContent


class NavigationModule:
    name = "navigation"

    def propose(
        self,
        percepts: Percepts,
        workspace: WorkspaceContent,
        self_model: SelfModel,
    ) -> Coalition | None:
        if percepts.touch > 0:
            hx, hy = percepts.heading
            turn = (hy, -hx)
            return Coalition(
                source=self.name,
                salience=0.55,
                content="obstacle ahead; turn",
                suggested_action="go_food" if not percepts.carrying_food else "go_nest",
                payload={"dir": turn},
            )
        broadcast = workspace.broadcast
        if "food" in broadcast and not percepts.carrying_food:
            return Coalition(
                source=self.name,
                salience=0.25,
                content="path integration toward food cue",
                suggested_action="go_food",
                payload={"dir": percepts.food_dir},
            )
        nx, ny = self_model.nest_vector
        if percepts.carrying_food or percepts.energy < 0.25:
            direction = percepts.nest_dir if percepts.nest_dir != (0, 0) else (nx, ny)
            return Coalition(
                source=self.name,
                salience=0.3,
                content="path integration toward nest",
                suggested_action="go_nest",
                payload={"dir": direction},
            )
        return None
