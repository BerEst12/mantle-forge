# Installer + docs smoke test

Run in **WSL** from repo root.

## 1. Installer (default copy mode)

```bash
cd /mnt/c/Users/xyz16/Documents/GitHub/mantle-forge
chmod +x installer/install.sh
./installer/install.sh
```

Pass:

- Node + Git OK
- `npm run test:tools` passes
- Skills copied as flat `mantle-*` dirs under Hermes `skills/` (7 dirs)

## 1b. Plugin install (recommended)

```bash
npm run plugin:hermes
npm run plugin:verify
```

Pass: `mantle-forge` enabled in `hermes plugins list`; bundle structure checks pass.

Verify skills (legacy or plugin):

```bash
hermes plugins list | grep mantle-forge
hermes skills list 2>/dev/null | grep mantle || ls ~/.hermes/skills/mantle-*
```

## 2. Installer dev mode (optional)

```bash
./installer/install.sh --dev
grep -A2 external_dirs ~/.hermes/config.yaml
```

## 3. mantle-forge init alias

```bash
npx mantle-forge help
```

## 4. Docs site build

```bash
cd docs/docusaurus
npm install
npm run build
```

Pass: `build` exits 0; output under `build/`.

## 5. Report back

- Installer pass/fail
- Skill count after install
- Docs build pass/fail
