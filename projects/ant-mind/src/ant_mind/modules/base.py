from __future__ import annotations

from typing import Protocol

from ant_mind.types import Coalition, Percepts, SelfModel, WorkspaceContent


class Specialist(Protocol):
    name: str

    def propose(
        self,
        percepts: Percepts,
        workspace: WorkspaceContent,
        self_model: SelfModel,
    ) -> Coalition | None: ...
