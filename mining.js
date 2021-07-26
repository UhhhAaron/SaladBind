const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const fetch = require("node-fetch");
const si = require("systeminformation");
const https = require('https');
const path = require('path');
let spinner;

async function run() {
    if (!fs.existsSync("./data/miners")){
        fs.mkdirSync("./data/miners");
    }
    console.clear();
    console.log(chalk.bold.cyan(`Configure your miner`))
    spinner = ora("Loading miner list").start();
    fetch('https://raw.githubusercontent.com/VukkyLtd/SaladBind/main/internal/miners.json?token=')
        .then(res => res.json())
        .then(async data => {
            spinner.stop();
            let minerList = [];
            let temp = await si.osInfo()
            let userPlatform = temp.platform;
            for (let i = 0; i < Object.keys(data).length; i++) {
                if(data[Object.keys(data)[i]].supported_os.includes(userPlatform)) {
                    minerList.push({
                        name: data[Object.keys(data)[i]].miner,
                        value: data[Object.keys(data)[i]]
                    });
                }
            }
            if (minerList.length == 0) {

            }
            const miner = await inquirer.prompt({
                type: "list",
                name: "miner",
                message: "Choose a miner",
                choices: minerList
            });
            ora(`Downloading ${miner.miner.miner} ${miner.miner.version}`).start();
            var downloadURL = miner.miner.download[userPlatform];
            const fileExtension = path.extname(downloadURL);
            const fileLocation = `./data/miners/${miner.miner.miner}-${miner.miner.version}.${fileExtension}`; 
            const request = https.get(downloadURL, function(response) {
                response.pipe(fs.createWriteStream(fileLocation)); // if you get error token expired likely yeah expired token :bukky:
            });
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