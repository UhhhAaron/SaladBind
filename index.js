const ora = require('ora');
const chalk = require('chalk');
const packageJson = require('./package.json');
const fs = require('fs');
const inquirer = require('inquirer');
const fetch = require("node-fetch");
const open = require("open");
const si = require("systeminformation");

console.clear();
process.title = `SaladBind v${packageJson.version}`;

const updateCheck = new Promise((resolve, reject) => {
    const spinner = ora('Checking for updates...').start();
    fetch('https://raw.githubusercontent.com/VukkyLtd/SaladBind/main/package.json')
        .then(res => res.json())
        .then(data => {
            if(data.version !== packageJson.version) {
                spinner.succeed(chalk.bold.green(`SaladBind ${data.version} is available!`));
                console.log("Download it from https://bit.ly/saladbind\n");
                setTimeout(() => {
                    resolve();
                },3500);
            } else {
                spinner.stop();
                resolve();
            }
        })
        .catch(err => {
            spinner.fail(chalk.bold.red(`Could not check for updates, please try again later.`));
            console.log(err);
            setTimeout(() => {
                resolve();
            },3500);
        });
});

(async () => {
    updateCheck.then(() => {
        console.log(chalk.bold.green(`SaladBind v${packageJson.version}`))
        if(!fs.existsSync('./data/config.json')) {
            console.log("Looks like this is your first time using SaladBind!\nLet's set it up. :)\n");
            require("./setup").run(false);
        } else {
            menu();
        }
    })
})();

async function menu(clear) {
    if(clear == undefined || clear == true) {
        console.clear();
    }
    console.log(chalk.bold.green(`SaladBind v${packageJson.version}`));
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
        case 'mining':
            require("./mining").run();
            break;
        case 'config':
            require("./setup").run();
            break;
        case 'discord':
            let temp = await si.osInfo()
            if(temp.platform == "linux") {
                console.log("\nhttps://discord.gg/HfBAtQ2afz");
            } else {
                open("https://discord.gg/HfBAtQ2afz");
                console.log("\nOpened the invite in your browser!");
            }
            setTimeout(() => {
                menu();
            }, 3500); 
        break;
        case 'exit':
            console.clear();
            process.exit(0);
        default:
            menu();
            break;
    }
}

module.exports = {
    menu
}
