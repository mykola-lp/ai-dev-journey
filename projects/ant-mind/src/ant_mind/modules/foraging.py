from __future__ import annotations

from ant_mind.types import Coalition, Percepts, SelfModel, WorkspaceContent


class ForagingModule:
    name = "foraging"

    def propose(
        self,
        percepts: Percepts,
        workspace: WorkspaceContent,
        self_model: SelfModel,
    ) -> Coalition | None:
        del workspace, self_model
        if percepts.carrying_food:
            return None
        cue = max(percepts.food_scent, percepts.vision_food)
        if cue <= 0 and percepts.hunger < 0.5:
            return None
        salience = percepts.hunger * max(cue, 0.15)
        on_food = percepts.food_dir == (0, 0) and percepts.food_scent >= 0.99
        if on_food:
            return Coalition(
                source=self.name,
                salience=salience + 0.4,
                content="food under body; pick it up",
                suggested_action="pick_up",
                payload={"dir": percepts.food_dir},
            )
        return Coalition(
            source=self.name,
            salience=salience,
            content=f"food cue {cue:.2f} with hunger {percepts.hunger:.2f}",
            suggested_action="go_food",
            payload={"dir": percepts.food_dir},
        )
