#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { execSync } = require('child_process');

yargs(hideBin(process.argv))
  .command(
    'generate [swaggerPath] [tsPath]',
    'generate typescript schemas',
    (yargs) =>
      yargs
        .positional('swaggerPath', {
          describe: 'path to swagger json file',
          default: '',
        })
        .positional('tsPath', {
          describe: 'target ts path',
          default: '',
        }),
    (argv) => {
      execSync(`openapi-typescript ${argv.swaggerPath} -o ${argv.tsPath}`);
    }
  )
  .parse();
