"""Tool schemas — what the Hermes LLM sees."""

MANTLE_SCAFFOLD = {
    "name": "mantle_scaffold",
    "description": (
        "Create a Mantle Sepolia-ready Hardhat project from a template. "
        "Use token-vault for the flagship demo or hardhat-mantle-starter for minimal."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "template": {
                "type": "string",
                "description": "Template name: token-vault or hardhat-mantle-starter",
            },
            "output_dir": {
                "type": "string",
                "description": "Output directory path (must not exist or be empty)",
            },
        },
        "required": ["template", "output_dir"],
    },
}

MANTLE_CHECK = {
    "name": "mantle_check",
    "description": "Validate that a project is Mantle Sepolia Hardhat ready.",
    "parameters": {
        "type": "object",
        "properties": {
            "project_dir": {"type": "string", "description": "Project directory"},
        },
        "required": ["project_dir"],
    },
}

MANTLE_AUDIT = {
    "name": "mantle_audit",
    "description": (
        "Run static Solidity analysis, optional Slither, and write security report plus agent brief."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "project_dir": {"type": "string"},
            "out": {"type": "string", "description": "Markdown report, default reports/security.md"},
            "json": {"type": "string", "description": "Structured findings JSON path"},
            "brief": {"type": "string", "description": "Agent audit workflow brief path"},
            "with_slither": {"type": "boolean", "description": "Run Slither when installed"},
        },
        "required": ["project_dir"],
    },
}

MANTLE_HARDEN = {
    "name": "mantle_harden",
    "description": (
        "Mandatory hardening gate: Slither, invariant/fuzz tests, and security reports."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "project_dir": {"type": "string"},
            "out": {"type": "string"},
            "json": {"type": "string"},
            "brief": {"type": "string"},
            "setup_only": {"type": "boolean", "description": "Check/install prerequisites only"},
            "skip_slither": {"type": "boolean", "description": "Dev only; not for flagship demo"},
        },
        "required": ["project_dir"],
    },
}

MANTLE_GAS_REPORT = {
    "name": "mantle_gas_report",
    "description": "Generate gas analysis report for a Hardhat project.",
    "parameters": {
        "type": "object",
        "properties": {
            "project_dir": {"type": "string"},
            "out": {"type": "string", "description": "Output path, default reports/gas.md"},
        },
        "required": ["project_dir"],
    },
}

MANTLE_DEPLOY = {
    "name": "mantle_deploy",
    "description": "Deploy contracts to Mantle Sepolia. Requires MANTLE_SEPOLIA_RPC_URL and MANTLE_PRIVATE_KEY.",
    "parameters": {
        "type": "object",
        "properties": {
            "project_dir": {"type": "string"},
            "network": {"type": "string", "description": "Default mantleSepolia"},
            "dry_run": {"type": "boolean", "description": "Compile and test only, skip broadcast"},
        },
        "required": ["project_dir"],
    },
}

MANTLE_REPORT = {
    "name": "mantle_report",
    "description": "Merge test, gas, security, and deploy artifacts into FINAL_REPORT.md.",
    "parameters": {
        "type": "object",
        "properties": {
            "project_dir": {"type": "string"},
            "out": {"type": "string", "description": "Output path, default FINAL_REPORT.md"},
        },
        "required": ["project_dir"],
    },
}
