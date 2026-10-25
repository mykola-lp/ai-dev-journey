from __future__ import annotations

from ant_mind.types import Coalition, Percepts, SelfModel, WorkspaceContent


class PheromoneModule:
    name = "pheromone"

    def propose(
        self,
        percepts: Percepts,
        workspace: WorkspaceContent,
        self_model: SelfModel,
    ) -> Coalition | None:
        del workspace, self_model
        if percepts.carrying_food or percepts.pheromone <= 0.05:
            return None
        return Coalition(
            source=self.name,
            salience=0.2 + percepts.pheromone * 0.6,
            content=f"pheromone trail {percepts.pheromone:.2f}",
            suggested_action="follow_pheromone",
            payload={"dir": percepts.pheromone_dir},
        )
