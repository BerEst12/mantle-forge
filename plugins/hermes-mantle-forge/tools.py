"""Tool handlers — subprocess wrappers for Mantle Forge Node CLIs."""

import json
import os
import subprocess
from pathlib import Path


def _repo_root() -> Path:
    root = os.environ.get("MANTLE_FORGE_ROOT", "").strip()
    if not root:
        return Path()
    return Path(root).resolve()


def _run_cli(cli_name: str, args: list[str], cwd: str | None = None) -> str:
    root = _repo_root()
    if not root.is_dir():
        return json.dumps({"error": "MANTLE_FORGE_ROOT is not set or invalid. Run: mantle-forge install --hermes"})

    cli = root / "tools" / cli_name / "cli.js"
    if not cli.is_file():
        return json.dumps({"error": f"CLI not found: {cli}"})

    cmd = ["node", str(cli), *args]
    try:
        proc = subprocess.run(
            cmd,
            cwd=cwd or str(root),
            capture_output=True,
            text=True,
            timeout=600,
            shell=False,
        )
        return json.dumps({
            "success": proc.returncode == 0,
            "exit_code": proc.returncode,
            "stdout": proc.stdout[-8000:] if proc.stdout else "",
            "stderr": proc.stderr[-4000:] if proc.stderr else "",
            "command": " ".join(cmd),
        })
    except subprocess.TimeoutExpired:
        return json.dumps({"error": "CLI timed out after 600s"})
    except Exception as exc:
        return json.dumps({"error": str(exc)})


def mantle_scaffold(args: dict, **kwargs) -> str:
    del kwargs
    template = args.get("template", "token-vault")
    output_dir = args.get("output_dir", "")
    if not output_dir:
        return json.dumps({"error": "output_dir is required"})
    return _run_cli("mantle-scaffold", [template, output_dir])


def mantle_check(args: dict, **kwargs) -> str:
    del kwargs
    project_dir = args.get("project_dir", "")
    if not project_dir:
        return json.dumps({"error": "project_dir is required"})
    return _run_cli("mantle-check", [project_dir])


def mantle_audit(args: dict, **kwargs) -> str:
    del kwargs
    project_dir = args.get("project_dir", "")
    if not project_dir:
        return json.dumps({"error": "project_dir is required"})
    cli_args = [project_dir]
    if args.get("out"):
        cli_args.extend(["--out", args["out"]])
    if args.get("json"):
        cli_args.extend(["--json", args["json"]])
    if args.get("brief"):
        cli_args.extend(["--brief", args["brief"]])
    if args.get("with_slither"):
        cli_args.append("--with-slither")
    return _run_cli("mantle-audit", cli_args)


def mantle_harden(args: dict, **kwargs) -> str:
    del kwargs
    project_dir = args.get("project_dir", "")
    if not project_dir:
        return json.dumps({"error": "project_dir is required"})
    cli_args = [project_dir]
    if args.get("out"):
        cli_args.extend(["--out", args["out"]])
    if args.get("json"):
        cli_args.extend(["--json", args["json"]])
    if args.get("brief"):
        cli_args.extend(["--brief", args["brief"]])
    if args.get("setup_only"):
        cli_args.append("--setup")
    if args.get("skip_slither"):
        cli_args.append("--skip-slither")
    return _run_cli("mantle-harden", cli_args)


def mantle_gas_report(args: dict, **kwargs) -> str:
    del kwargs
    project_dir = args.get("project_dir", "")
    if not project_dir:
        return json.dumps({"error": "project_dir is required"})
    cli_args = [project_dir]
    if args.get("out"):
        cli_args.extend(["--out", args["out"]])
    return _run_cli("mantle-gas-report", cli_args)


def mantle_deploy(args: dict, **kwargs) -> str:
    del kwargs
    project_dir = args.get("project_dir", "")
    if not project_dir:
        return json.dumps({"error": "project_dir is required"})
    cli_args = [project_dir]
    network = args.get("network") or "mantleSepolia"
    cli_args.extend(["--network", network])
    if args.get("dry_run"):
        cli_args.append("--dry-run")
    return _run_cli("mantle-deploy", cli_args)


def mantle_report(args: dict, **kwargs) -> str:
    del kwargs
    project_dir = args.get("project_dir", "")
    if not project_dir:
        return json.dumps({"error": "project_dir is required"})
    cli_args = [project_dir]
    if args.get("out"):
        cli_args.extend(["--out", args["out"]])
    return _run_cli("mantle-report", cli_args)
