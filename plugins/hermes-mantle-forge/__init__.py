"""Mantle Forge Hermes plugin — registers tools and bundled skills."""

from pathlib import Path

from . import schemas, tools


def register(ctx):
    """Wire Mantle CLI tools and bundle skills for Hermes."""
    registry = [
        ("mantle_scaffold", schemas.MANTLE_SCAFFOLD, tools.mantle_scaffold),
        ("mantle_check", schemas.MANTLE_CHECK, tools.mantle_check),
        ("mantle_audit", schemas.MANTLE_AUDIT, tools.mantle_audit),
        ("mantle_harden", schemas.MANTLE_HARDEN, tools.mantle_harden),
        ("mantle_gas_report", schemas.MANTLE_GAS_REPORT, tools.mantle_gas_report),
        ("mantle_deploy", schemas.MANTLE_DEPLOY, tools.mantle_deploy),
        ("mantle_report", schemas.MANTLE_REPORT, tools.mantle_report),
    ]

    for name, schema, handler in registry:
        ctx.register_tool(
            name=name,
            toolset="mantle_forge",
            schema=schema,
            handler=handler,
            description=schema.get("description", ""),
        )

    skills_dir = Path(__file__).resolve().parent / "skills"
    if skills_dir.is_dir():
        for child in sorted(skills_dir.iterdir()):
            skill_md = child / "SKILL.md"
            if child.is_dir() and skill_md.is_file():
                ctx.register_skill(child.name, skill_md)
