const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
let spinner;

async function run() {
    console.clear();
    console.log(chalk.bold.cyan(`Configure your miner`))
    const pool = await inquirer.prompt([{
        type: 'list',
        name: "pool",
        message: "Choose a pool",
        choices: [{
            name: `Ethermine`,
            value: "ethermine"
        }, {
            name: `NiceHash`,
            value: "nicehash"
        }]
    }]);
    spinner = ora("Loading miner list").start();
    setTimeout(async () => {
        spinner.stop();
        const miner = await inquirer.prompt([{
            type: 'list',
            name: "miner",
            message: "Choose a miner",
            choices: [{
                name: `PhoenixMiner`,
                value: "phoenix"
            }, {
                name: `XMRig`,
                value: "xmrig"
            }]
        }]);
        spinner = ora(`Downloading ${miner.miner}.exe`).start();
    }, 2500);
}

module.exports = {
    run
};