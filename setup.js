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
            name: `Automatic ${chalk.yellow("(Salad auth token required!)")}`,
            value: "api"
        }, {
            name: `Manual`,
            value: "manual"
        }]
    }]);
    if (useapi.useapi == "api") {
        //auth
        console.log(chalk.green("We need the token to get your Wallet and Rig ID automatically.\nThey will not be stored!"))
        const auth = await inquirer.prompt([
            {
                type: 'input',
                name: 'auth',
                message: 'What is your Salad Access Token?',
                validate: function (input) {
                    if (input.length == 778) {
                        return true;
                    }
                    return `Your Salad Access Token is required for automatic mode. If you don't want this, restart SaladBind and select manual. ${chalk.yellow.bold("You may be seeing this if you entered the token incorrectly, the token is 778 chars long!")}`;
                }
            }
        ]);
        const spinner = ora("Getting miner details...").start();
        try {
            let minerDetails = await require("./internal/getMachine").getInfo(auth.auth);
            if (!fs.existsSync("./data")){
                fs.mkdirSync("./data");
            }
            fs.writeFileSync("./data/config.json", JSON.stringify({"minerId": minerDetails.minerId}));
            spinner.stop();
            console.clear();
            console.log(chalk.bold.greenBright(`Congratulations!! :D`))
            console.log("SaladBind has now been configured!\nStarting in 5 seconds...")
            setTimeout(() => {
                require("./index").menu();
            }, 5000);
        } catch (e) {
            spinner.fail();
            console.log(e);
            console.log(chalk.bold.red("An error occurred, please contact support on our Discord server (https://discord.gg/HfBAtQ2afz) and attach an image of the data above."));
        }
    } else {
        const worker = await inquirer.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'What is your Salad worker ID? (both NiceHash\'s Rig ID and Ethermine\'s Worker ID work)',
                validate: function (input) {
                    if (input.length == 15) {
                        return true;
                    }
                    return `If you don't want to manually enter your Worker ID, you can use automatic mode. ${chalk.yellow.bold("You may be seeing this if you entered the Worker ID incorrectly!")}`;
                }
            }
        ]);
        const spinner = ora("Saving...").start();
        if (!fs.existsSync("./data")){
            fs.mkdirSync("./data");
        }
        fs.writeFileSync("./data/config.json", JSON.stringify({"minerId": worker.id}));
        spinner.stop();
        console.clear();
        console.log(chalk.bold.greenBright(`Congratulations!! :D`))
        console.log("SaladBind has now been configured!\nStarting in 5 seconds...")
        setTimeout(() => {
            require("./index").menu();
        }, 5000);
    }
}

module.exports = {
    run
};