from __future__ import annotations

from ant_mind.types import Coalition, Percepts, SelfModel, WorkspaceContent


class ThreatModule:
    name = "threat"

    def propose(
        self,
        percepts: Percepts,
        workspace: WorkspaceContent,
        self_model: SelfModel,
    ) -> Coalition | None:
        del workspace, self_model
        if percepts.threat <= 0:
            return None
        salience = 0.4 + percepts.threat * 2.5
        if percepts.vision_threat:
            salience += 0.3
        return Coalition(
            source=self.name,
            salience=salience,
            content=f"threat intensity {percepts.threat:.2f}; flee",
            suggested_action="flee",
            payload={"dir": (-percepts.threat_dir[0], -percepts.threat_dir[1])},
        )
