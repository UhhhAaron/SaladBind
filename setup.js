const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');

function run(clear) {
    if(clear == undefined || clear == true) {
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
        continueSetup(clear);
    }
}
async function continueSetup(clear) {
    if(clear == undefined || clear == true) {
        console.clear();
        console.log(chalk.bold.cyan(`Configure SaladBind`))
    }
    const useapi = await inquirer.prompt([{
        type: 'list',
        name: "useapi",
        message: "How would you like to provide your mining details?",
        choices: [{
            name: `Automatic ${chalk.yellow("(Salad Auth tokens required!)")}`,
            value: "api"
        }, {
            name: `Manual`,
            value: "manual"
        }]
    }]);
    if (useapi.useapi == "api") {
        //auth
        console.log(chalk.green("We need the tokens to get your Wallet and Rig ID automatically.\nThey will not be stored!"))
        const auth = await inquirer.prompt([
            {
                type: 'input',
                name: 'auth',
                message: 'What is your Salad Access Token?',
                validate: function (input) {
                    if (input.length == 778) {
                        return true;
                    }
                    return `Your Salad Access Token is required for automatic mode. If you don't want this, restart SaladBind and select manual. ${chalk.yellow.bold("You may be seeing this if you entered the token incorrectly!")}`;
                }
            },
            {
                type: 'input',
                name: 'refresh',
                message: 'What is your Salad Refresh Token?',
                validate: function (input) {
                    if (input.length == 36) {
                        return true;
                    }
                    return `Your Salad Refresh Token is required for automatic mode. If you don't want this, restart SaladBind and select manual. ${chalk.yellow.bold("You may be seeing this if you entered the token incorrectly!")}`;
                }
            }
        ]);
        const spinner = ora("Getting miner details...").start();
        let minerDetails = await require("./internal/getMachine").getInfo(auth.auth, auth.refresh);
        if (!fs.existsSync("./data")){
            fs.mkdirSync("./data");
        }
        fs.writeFileSync("./data/config.json", JSON.stringify({"minerId": minerDetails.minerId}));
        spinner.stop();
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