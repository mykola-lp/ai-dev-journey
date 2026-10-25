# ant-mind

`ant-mind` is a small functional model of a single ant's access consciousness: it represents what reaches attention and can be reported. It is not a model of human consciousness or a claim about subjective experience.

Specialist modules compete for a limited attention channel. The selected coalitions enter a global workspace, influence the ant's action, and update a self-model tied to its body.

## Run it

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
python -m ant_mind --ticks 40
```

Start the browser inspector with `python -m ant_mind.inspector`, then open http://127.0.0.1:8765. Run the test suite with `python -m pytest`.

Useful options:

```bash
python -m ant_mind --ticks 40 --threat
```

Each tick follows this sequence: sensors and drives → specialist proposals → attention (one to three coalitions) → global workspace → action selection → body in a stub world → self-model update → text report.
