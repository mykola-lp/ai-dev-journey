from __future__ import annotations

import argparse

from ant_mind.ant import Ant
from ant_mind.world import World


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the single-ant access-consciousness loop")
    parser.add_argument("--ticks", type=int, default=40)
    parser.add_argument("--threat", action="store_true", help="inject a nearby threat at tick 0")
    args = parser.parse_args()

    world = World.default()
    if args.threat:
        world.inject_threat(6, 5, intensity=1.0)
    ant = Ant(world)
    for report in ant.run(args.ticks):
        print(f"[{report.tick:03d}] {report.text}")


if __name__ == "__main__":
    main()
