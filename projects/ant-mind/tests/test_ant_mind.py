from ant_mind.ant import Ant
from ant_mind.attention import select
from ant_mind.modules.foraging import ForagingModule
from ant_mind.modules.threat import ThreatModule
from ant_mind.self_model import update_self
from ant_mind.types import Action, Body, Percepts, SelfModel, WorkspaceContent
from ant_mind.world import World


def _percepts(**overrides) -> Percepts:
    base = dict(
        food_scent=1.0,
        pheromone=0.0,
        threat=0.0,
        nest_scent=0.2,
        touch=0.0,
        vision_food=1.0,
        vision_threat=0.0,
        energy=0.9,
        hunger=1.0,
        nest_distance=6.0,
        carrying_food=False,
        heading=(1, 0),
        position=(3, 5),
        food_dir=(1, 0),
        nest_dir=(-1, 0),
        threat_dir=(1, 0),
        pheromone_dir=(0, 0),
    )
    base.update(overrides)
    return Percepts(**base)


def test_threat_beats_foraging_in_attention():
    percepts = _percepts(threat=1.0, vision_threat=1.0)
    empty = WorkspaceContent()
    self_model = SelfModel()
    food = ForagingModule().propose(percepts, empty, self_model)
    danger = ThreatModule().propose(percepts, empty, self_model)
    assert food is not None and danger is not None
    winner = select([food, danger], capacity=1)[0]
    assert winner.source == "threat"
    assert danger.salience > food.salience


def test_threat_wins_live_tick():
    world = World.default()
    world.inject_threat(6, 5, intensity=1.0)
    ant = Ant(world)
    report = ant.tick()
    assert report.coalitions
    assert report.coalitions[0]["source"] == "threat"
    assert "threat" in report.workspace
    assert "threat" in report.text


def test_report_contains_workspace_contents():
    ant = Ant(World.default())
    report = ant.tick()
    assert report.workspace
    assert report.workspace != "(empty)"
    assert report.workspace.split(":")[0] in report.text
    for coalition in report.coalitions:
        assert coalition["source"] in report.workspace
        assert coalition["content"] in report.workspace


def test_self_model_updates_after_action():
    model = SelfModel(energy=1.0, last_action="idle", nest_vector=(0, 0))
    body = Body(x=6, y=5, energy=0.77, carrying_food=True)
    action = Action(name="move_east", dx=1, dy=0, reason="return")
    update_self(model, body, action)
    assert model.last_action == "move_east"
    assert model.energy == 0.77
    assert model.carrying_food is True
    assert model.nest_vector == (-1, 0)


def test_ant_follows_trail_instead_of_idling():
    ant = Ant(World.default())
    report = ant.tick()
    assert report.action.startswith("move_")
    assert (ant.body.x, ant.body.y) != (ant.world.nest_x, ant.world.nest_y)


def test_live_self_model_tracks_movement():
    ant = Ant(World.default())
    before_energy = ant.body.energy
    report = ant.tick()
    assert ant.self_model.last_action == report.action
    assert ant.self_model.energy == ant.body.energy
    assert ant.body.energy < before_energy
    if report.action.startswith("move_"):
        assert ant.self_model.nest_vector != (0, 0)
