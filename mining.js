const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const fetch = require("node-fetch");
let spinner;

async function run() {
    if (!fs.existsSync("./data/miners")){
        fs.mkdirSync("./data/miners");
    }
    console.clear();
    console.log(chalk.bold.cyan(`Configure your miner`))
    spinner = ora("Loading miner list").start();
    fetch('https://raw.githubusercontent.com/VukkyLtd/SaladBind/main/internal/miners.json')
        .then(res => res.json())
        .then(async data => {
            spinner.stop();
            let minerList = [];
            for (let i = 0; i < Object.keys(data).length; i++) {
                minerList.push({
                    name: data[Object.keys(data)[i]].miner,
                    value: data[Object.keys(data)[i]]
                });
            }
            const miner = await inquirer.prompt({
                type: "list",
                name: "miner",
                message: "Choose a miner",
                choices: minerList
            });
            ora(`Downloading ${miner.miner.miner} ${miner.miner.version}`).start();
        })
        .catch(err => {
            spinner.fail(chalk.bold.red(`Could not load miner list. Please try again later.`));
            console.log(err);
            setTimeout(() => {
                require("./index").menu();
            }, 3500);
        });
}

module.exports = {
    run
};