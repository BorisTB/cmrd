# cmrd

A tiny utility for building command-line strings with clean and simple syntax.

---

## Installation

```bash
npm install cmrd
```


## Usage

```typescript
import cmrd from "cmrd";

const npm = {
  install: cmrd`npm i`,
  add: cmrd`npm i ${0}`,
  addDev: cmrd`npm i -D ${0}`,
  dlx: cmrd`npx --yes ${0} --verbose ${1}`,
  run: cmrd`npm run ${0}``-- ${1}`
};

npm.install() // -> "npm i"
npm.add('cmrd') // -> "npm i cmrd"
npm.addDev('cmrd') // -> "npm i -D cmrd"
npm.dlx('create-nx-workspace') // -> "npx --yes create-nx-workspace --verbose"
npm.dlx('create-nx-workspace cmrd', '--preset=apps') // -> "npx --yes create-nx-workspace cmrd --verbose --preset=apps"
npm.run('build') // -> "npm run build"
npm.run('build', '--skip-cache') // -> "npm run build -- --skip-cache"
```
