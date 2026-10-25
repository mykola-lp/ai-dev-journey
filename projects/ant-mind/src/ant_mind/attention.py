from __future__ import annotations

from ant_mind.types import Coalition

CAPACITY = 3
MIN_SALIENCE = 0.05


def select(coalitions: list[Coalition], capacity: int = CAPACITY) -> list[Coalition]:
    """Limited attention: keep the most salient coalitions, drop the rest."""
    ranked = sorted(
        (c for c in coalitions if c.salience >= MIN_SALIENCE),
        key=lambda c: c.salience,
        reverse=True,
    )
    return ranked[:capacity]
