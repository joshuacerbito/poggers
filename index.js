#!/usr/bin/env node
const shell      = require('shelljs');
const program    = require('commander');
const { prompt } = require('inquirer');

const DEFAULTS = {
  wordpress: {
    db_host: 'localhost',
    db_prefix: 'wp_'
  }
};

const QUESTIONS = {
  wordpress: [
    {
      type: 'input',
      name: 'db_name',
      message: 'Enter Database Name: '
    },
    {
      type: 'input',
      name: 'db_user',
      message: 'Enter Database User: '
    },
    {
      type: 'password',
      name: 'db_password',
      message: 'Enter Database Password: '
    },
    {
      type: 'input',
      name: 'db_host',
      message: 'Enter Database Host: ',
      default: 'localhost'
    },
    {
      type: 'input',
      name: 'db_prefix',
      message: 'Enter Database Prefix: ',
      default: 'wp_'
    }
  ]
};

const INSTALL = {
  cms: {
    wordpress(builder = 'gulp', dir = '.', config = false) {
      if(!config) {
        console.error('Wordpress Config was not filled up');
        return;
      }

      console.log(config);

      console.log('🔥  Installing Wordpress...');
      shell.exec(`git clone https://github.com/roots/bedrock.git ${dir}`);
      shell.exec('composer install');
      shell.exec('rm -rf .git');

      console.log('\n🔥  Installing WP CLI...');
      const hasWP = shell.which('wp');
      if(((hasWP.code > 0) && (hasWP.stdout.length == 0))) {
        shell.exec('curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar');
        shell.exec('chmod +x wp-cli.phar');
        shell.exec('mv wp-cli.phar /usr/local/bin/wp');
      }

      console.log('\n🔥  Installing Starter Theme...');
      shell.exec(`git clone https://github.com/joshuacerbito/poggers-wp-${builder}.git ./web/app/themes/starter-theme`);

      // @TODO
      // - Make an interactive Wordpress Installer using inquirer ^
      // shell.exec('wp theme activate starter-theme');

      console.log('\n🔥  Installing Timber...');
      shell.exec('git clone https://github.com/timber/timber.git ./web/app/mu-plugins/timber');

      console.log(`\n🔥  You're good to go!  🔥`);
    },
    raw() {
      console.log('No CMS');
      // clone poggers raw repo
    }
  }
};

const getInputs = (cms = 'raw', builder = '', dir = '.') => {
  prompt(QUESTIONS[cms]).then(config => {
    INSTALL.cms[cms](builder, dir, config);
  });
};

program
  .version('0.0.1')
  .description('The hypest Front-End setup generator');

program
  .command('generate [cms] [builder] [dir]')
  .alias('g')
  .description('Generate Project Setup')
  .action((cms = 'raw', builder = 'gulp', dir = '.') => {
    console.log(`Generating ${cms.toUpperCase()} Setup with ${builder.toUpperCase()}`);
    getInputs(cms, builder, dir);
  });

program
  .command('test-command')
  .action(() => {
    PROMPTS.wordpress.install();
  });

program.on('--help', () => {
  console.log('\n');
});

program.parse(process.argv);
