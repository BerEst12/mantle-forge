# Mantle Hardhat dependency matrix

Known-good starter combo for Mantle Sepolia projects:

- `hardhat`: `^2.26.2`
- `@nomicfoundation/hardhat-toolbox`: `^6.1.2`
- `hardhat-gas-reporter`: `^2.3.0`
- `@openzeppelin/contracts`: `^5.6.1`
- `dotenv`: `^16.6.1`

## Install note

If `npm install` fails with an `ERESOLVE` peer-dependency error involving `hardhat-gas-reporter`, prefer aligning the version to `^2.3.0` instead of forcing the install. This keeps the toolbox dependency tree consistent and avoids a brittle scaffold.

## Verification

After install, run:

```bash
npx hardhat compile
npx hardhat test
```

If the scaffold includes gas reporting, run:

```bash
REPORT_GAS=true npx hardhat test
```
