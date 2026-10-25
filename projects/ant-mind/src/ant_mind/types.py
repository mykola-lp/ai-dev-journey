from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class Body:
    x: int
    y: int
    energy: float = 1.0
    hunger: float = 0.35
    carrying_food: bool = False
    heading: tuple[int, int] = (1, 0)


@dataclass
class Percepts:
    food_scent: float
    pheromone: float
    threat: float
    nest_scent: float
    touch: float
    vision_food: float
    vision_threat: float
    energy: float
    hunger: float
    nest_distance: float
    carrying_food: bool
    heading: tuple[int, int]
    position: tuple[int, int]
    food_dir: tuple[int, int]
    nest_dir: tuple[int, int]
    threat_dir: tuple[int, int]
    pheromone_dir: tuple[int, int]


@dataclass
class Coalition:
    source: str
    salience: float
    content: str
    suggested_action: str
    payload: dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkspaceContent:
    coalitions: list[Coalition] = field(default_factory=list)

    @property
    def broadcast(self) -> str:
        if not self.coalitions:
            return "(empty)"
        return " | ".join(f"{c.source}: {c.content}" for c in self.coalitions)

    @property
    def winner(self) -> Coalition | None:
        if not self.coalitions:
            return None
        return self.coalitions[0]


@dataclass
class Action:
    name: str
    dx: int = 0
    dy: int = 0
    reason: str = ""


@dataclass
class SelfModel:
    energy: float = 1.0
    last_action: str = "idle"
    carrying_food: bool = False
    nest_vector: tuple[int, int] = (0, 0)
    body_id: str = "this-body"

    def summary(self) -> str:
        food = "carrying food" if self.carrying_food else "not carrying food"
        nx, ny = self.nest_vector
        return (
            f"I={self.body_id}; energy={self.energy:.2f}; {food}; "
            f"last={self.last_action}; nest_vector=({nx},{ny})"
        )


@dataclass
class Report:
    tick: int
    workspace: str
    action: str
    self_summary: str
    text: str
    coalitions: list[dict[str, Any]] = field(default_factory=list)
    drives: dict[str, float] = field(default_factory=dict)
