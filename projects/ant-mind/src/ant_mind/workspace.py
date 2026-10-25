from __future__ import annotations

from ant_mind.types import Coalition, WorkspaceContent


class GlobalWorkspace:
    """Broadcast channel: whatever is here is available for report and action."""

    def __init__(self) -> None:
        self.content = WorkspaceContent()

    def update(self, coalitions: list[Coalition]) -> WorkspaceContent:
        self.content = WorkspaceContent(coalitions=list(coalitions))
        return self.content
