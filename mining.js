const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const fetch = require("node-fetch");
const si = require("systeminformation");
const https = require('https');
const path = require('path');
let spinner;


async function downloadFile(url, location, name) {
    const stream = fs.createWriteStream(location);
    const request = await https.get(url, function(response) {
        if(parseInt(response.statusCode) >= 200 && parseInt(response.statusCode) < 300) { 
            response.pipe(stream);
            stream.on('finish', function() {
                stream.close(function(){
                    spinner.succeed(chalk.bold.green(`Downloaded ${name}`));
                });
            });
        } else {
            downloadFile(response.headers.location, location, name);
        }
    });
}

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
                console.log(chalk.bold.red("No miner found for your platform."));
                process.exit();
            }
            const miner = await inquirer.prompt({
                type: "list",
                name: "miner",
                message: "Choose a miner",
                choices: minerList
            });
            spinner = ora(`Downloading ${miner.miner.miner}-${miner.miner.version}`).start();
            var downloadURL = miner.miner.download[userPlatform];
            const fileExtension = path.extname(downloadURL);
            const fileName = `${miner.miner.miner}-${miner.miner.version}`
            const fileLocation = `./data/miners/${fileName}${fileExtension}`; 
            await downloadFile(downloadURL, fileLocation, fileName);
        })
        .catch(err => {
            spinner.fail(chalk.bold.red(`Could not start a miner. Please try again later.`));
            console.log(err);
            setTimeout(() => {
                require("./index").menu();
            }, 3500);
        });
}

module.exports = {
    run
};