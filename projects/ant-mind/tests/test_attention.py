from ant_mind.attention import select
from ant_mind.types import Coalition


def test_attention_displaces_weaker_stimulus():
    weak = Coalition("foraging", 0.2, "faint food", "go_food")
    strong = Coalition("threat", 0.9, "predator nearby", "flee")
    chosen = select([weak, strong], capacity=1)
    assert len(chosen) == 1
    assert chosen[0].source == "threat"


def test_attention_capacity_keeps_top_three():
    coalitions = [
        Coalition(f"m{i}", salience=float(i), content=str(i), suggested_action="idle")
        for i in range(6)
    ]
    chosen = select(coalitions, capacity=3)
    assert [c.source for c in chosen] == ["m5", "m4", "m3"]
