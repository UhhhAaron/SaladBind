const ora = require('ora');
const chalk = require('chalk');
const packageJson = require('./package.json');
const fs = require('fs');
const inquirer = require('inquirer');
const fetch = require("node-fetch");
const open = require("open");

console.clear();
process.title = "SaladBind";

const updateCheck = new Promise((resolve, reject) => {
    const spinner = ora('Checking for updates...').start();
    fetch('https://raw.githubusercontent.com/VukkyLtd/SaladBind/main/package.json')
        .then(res => res.json())
        .then(data => {
            if(data.version !== packageJson.version) {
                spinner.succeed(chalk.bold.green(`SaladBind ${data.version} is available!`));
                console.log("Download it from https://bit.ly/saladbind");
                setTimeout(() => {
                    resolve();
                },2500);
            } else {
                spinner.succeed(chalk.bold.green(`SaladBind is up to date!`));
                setTimeout(() => {
                    resolve();
                },500);
            }
        })
        .catch(err => {
            spinner.fail(chalk.bold.red(`Could not check for updates. Please try again later.`));
            setTimeout(() => {
                resolve();
            },2500);
        });
});

(async () => {
    updateCheck.then(() => {
        console.log(chalk.bold.green(`SaladBind ${packageJson.version}`))
        if(!fs.existsSync('./data/config.json')) {
            console.log("Welcome to SaladBind! Let's set things up now :)\n");
            require("./setup").run(false);
        } else {
            menu(); //maybe?
        }
    })
})();

async function menu() {
    console.clear();
    console.log(chalk.bold.green(`SaladBind ${packageJson.version}`));
    const questions = [
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'Start mining',
                    value: 'mining'
                },
                {
                    name: 'Configure SaladBind',
                    value: 'config'
                },
                {
                    name: 'Join the SaladBind Discord',
                    value: 'discord'
                },
                {
                    name: 'Exit SaladBind',
                    value: 'exit'
                }
            ]
        }
    ];
    const answers = await inquirer.prompt(questions);
    switch (answers.menu) {
        case 'config':
            require("./setup").run();
        break;
        case 'discord':
            open("https://discord.gg/HfBAtQ2afz");
            console.log("\nOpened the invite in your browser!");
            setTimeout(() => {
                menu();
            }, 2500);
            break;
        break;
        case 'exit':
            console.clear();
            process.exit(0);
        break;
    }
}

module.exports = {
    menu
}