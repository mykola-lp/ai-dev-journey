from __future__ import annotations

from ant_mind.action import select_action
from ant_mind.attention import select as select_attention
from ant_mind.modules import default_specialists
from ant_mind.report import make_report
from ant_mind.self_model import update_self
from ant_mind.sensors import sense
from ant_mind.types import Body, Report, SelfModel, WorkspaceContent
from ant_mind.workspace import GlobalWorkspace
from ant_mind.world import World


class Ant:
    def __init__(self, world: World | None = None) -> None:
        self.world = world or World.default()
        self.body = Body(x=self.world.nest_x, y=self.world.nest_y)
        self.workspace = GlobalWorkspace()
        self.self_model = SelfModel()
        self.specialists = default_specialists()
        self.tick_count = 0
        self.history: list[Report] = []

    def tick(self) -> Report:
        percepts = sense(self.world, self.body)
        coalitions = []
        for specialist in self.specialists:
            proposal = specialist.propose(percepts, self.workspace.content, self.self_model)
            if proposal is not None:
                coalitions.append(proposal)
        selected = select_attention(coalitions)
        content: WorkspaceContent = self.workspace.update(selected)
        action = select_action(
            content,
            percepts,
            self.self_model,
            can_move=self.world.can_move,
        )
        self.world.apply(self.body, action)
        update_self(self.self_model, self.body, action)
        self.tick_count += 1
        report = make_report(self.tick_count, content, action, percepts, self.self_model)
        self.history.append(report)
        return report

    def run(self, ticks: int) -> list[Report]:
        return [self.tick() for _ in range(ticks)]

    def snapshot(self) -> dict:
        last = self.history[-1] if self.history else None
        return {
            "tick": self.tick_count,
            "position": [self.body.x, self.body.y],
            "body": {
                "energy": self.body.energy,
                "hunger": self.body.hunger,
                "carrying_food": self.body.carrying_food,
                "heading": list(self.body.heading),
            },
            "self_model": {
                "energy": self.self_model.energy,
                "last_action": self.self_model.last_action,
                "carrying_food": self.self_model.carrying_food,
                "nest_vector": list(self.self_model.nest_vector),
                "body_id": self.self_model.body_id,
            },
            "workspace": self.workspace.content.broadcast,
            "last_report": None
            if last is None
            else {
                "tick": last.tick,
                "text": last.text,
                "action": last.action,
                "workspace": last.workspace,
                "self_summary": last.self_summary,
                "coalitions": last.coalitions,
                "drives": last.drives,
            },
            "world": {
                "width": self.world.width,
                "height": self.world.height,
                "nest": [self.world.nest_x, self.world.nest_y],
                "foods": [{"x": f.x, "y": f.y, "amount": f.amount} for f in self.world.foods],
                "threat": None
                if self.world.threat is None
                else {
                    "x": self.world.threat.x,
                    "y": self.world.threat.y,
                    "intensity": self.world.threat.intensity,
                },
            },
        }
