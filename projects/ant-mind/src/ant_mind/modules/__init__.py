from ant_mind.modules.foraging import ForagingModule
from ant_mind.modules.navigation import NavigationModule
from ant_mind.modules.nest import NestModule
from ant_mind.modules.pheromone import PheromoneModule
from ant_mind.modules.threat import ThreatModule


def default_specialists() -> list:
    return [
        ForagingModule(),
        NavigationModule(),
        ThreatModule(),
        NestModule(),
        PheromoneModule(),
    ]
