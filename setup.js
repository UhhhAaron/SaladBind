const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');

function run(clear) {
    if(!clear || clear == true) {
        console.clear();
        console.log(chalk.bold.cyan(`Configure SaladBind`))
    }
    if (fs.existsSync('./data/config.json')) {
        inquirer.prompt([{
            type: 'confirm',
            name: 'overwrite',
            message: chalk.yellow("An older config file was found! Are you sure you want to overwrite it?"),
            default: false
        }]).then(function (answers) {
            if (answers.overwrite) {
                continueSetup()
            } else {
                require("./index").menu();
            }
        });
    } else {
        continueSetup();
    }
}
async function continueSetup() {
    console.clear();
    console.log(chalk.bold.cyan(`Configure SaladBind`))
    const useapi = await inquirer.prompt([{
        type: 'list',
        name: "useapi",
        message: "How would you like to provide your mining details?",
        choices: [{
            name: `Automatic ${chalk.yellow("(Salad Auth token required!)")}`,
            value: "api"
        }, {
            name: `Manual`,
            value: "manual"
        }]
    }]);
    if (useapi.useapi == "api") {
        //auth
        const auth = await inquirer.prompt([{
            type: 'input',
            name: 'auth',
            message: 'What is your Salad Auth Token?',
            validate: function (input) {
                if (input.length > 0) {
                    return true;
                }
                return "Your Salad Auth Token is required for automatic mode. If you don't want this, restart SaladBind and select manual.";
            }
        }]);
        ora("Getting miner details...").start();
    } else {
        //manual
    }
    console.clear();
    console.log(chalk.bold.greenBright(`Congratulations!! :D`))
    console.log("SaladBind is now configured!\nStarting in 5 seconds...")
    setTimeout(() => {
        require("./index").menu();
    }, 5000);
}

module.exports = {
    run
};