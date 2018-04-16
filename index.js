#!/usr/bin/env node
const shell     = require('shelljs');
const program   = require('commander');
const inquirer  = require('inquirer');

const install = {
  cms: {
    wordpress() {
      console.log(`Installing Wordpress...`);
      shell.exec('git clone https://github.com/roots/bedrock.git .');

      // clone poggers wordpress theme
    },
    raw() {
      console.log('No CMS');
      // clone poggers raw repo
    }
  }
};

program
  .version('0.0.1')
  .description('The hypest Front-End setup generator');

program
  .command('generate [dir] [cms] [builder]')
  .alias('g')
  .description('Generate Project Setup')
  .action((dir = '.', cms = 'raw', builder = 'gulp') => {
    console.log(`Generating ${cms.toUpperCase()} Setup with ${builder.toUpperCase()}`);
    install.cms[cms].apply(this, arguments);
  });

program.on('--help', () => {
  console.log('\n');
});

program.parse(process.argv);
