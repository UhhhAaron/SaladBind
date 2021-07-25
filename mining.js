const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');

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
}

module.exports = {
    run
};