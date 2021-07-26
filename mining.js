const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const fetch = require("node-fetch");
const si = require("systeminformation");
const https = require('https');
const path = require('path');
const extract = require('extract-zip')
let spinner;



async function extractFile(location, folderName, fileExtension) {
    if (!fs.existsSync(location)){
		fs.mkdirSync(location);
	}
    await extract(require('path').resolve(location), { dir: path.resolve(`./data/miners/${folderName}`) });
	spinner.succeed(chalk.bold.green(`Extracted ${folderName}`));
}
const downloadFile = async function(url, location, name) {
    return new Promise(async (resolve, reject) => {
        const stream = fs.createWriteStream(location);
        const request = https.get(url, function(response) {
            if(parseInt(response.statusCode) >= 200 && parseInt(response.statusCode) < 300) { 
                response.pipe(stream);
                stream.on('finish', function() {
                    stream.close(function(){
                        spinner.succeed(chalk.bold.green(`Downloaded ${name}`));
                        resolve();
                    }); // confusdion?
                });
            } else {
                downloadFile(response.headers.location, location, name).then(() => {
					resolve();
				});
			} // im confused on what happened there
        });
    });
}

async function run() {
	if (!fs.existsSync("./data/miners")){
		fs.mkdirSync("./data/miners");
	}
	console.clear();
	console.log(chalk.bold.cyan(`Configure your miner`))
	spinner = ora("Loading miner list").start();
	fetch('https://raw.githubusercontent.com/VukkyLtd/SaladBind/main/internal/miners.json?token=ALJSKC27NQQ2YU43LJOK2B3A73WMI') //fuck you token
		.then(res => res.json())
		.then(async data => {
			spinner.stop();
			let minerList = [];
			let temp = await si.osInfo()
			let temp2 = await si.graphics()
			let userPlatform = "linux" //temp.platform;
			let GPUs = [];  
			for (let i = 0; i < temp2.controllers.length; i++) {
				let compatibleAlgos = []
				for (let j = 0; j < Object.keys(data.algos).length; j++) {
					if(temp2.controllers[i].vram > data.algos[Object.keys(data.algos)[j]]) {
						compatibleAlgos.push(Object.keys(data.algos)[j])
					}
				}
				if (compatibleAlgos.length > 0) {
					GPUs.push({"algos": compatibleAlgos, "vendor": temp2.controllers[i].vendor.toLowerCase()});
				}
			}
			for (let i = 0; i < Object.keys(data.miners).length; i++) {
				let minerData = data.miners[Object.keys(data.miners)[i]];
				const minerSupportsOS = minerData.supported_os.includes(userPlatform)
				const algosSupportsGPU = minerData.algos.filter(algo => GPUs.filter(gpu => gpu.algos.includes(algo)).length > 0).length > 0
				const minerSupportsGPU = GPUs.filter(gpu => minerData.supported_gpus.includes(gpu.vendor)).length > 0
				if(minerSupportsOS && minerSupportsGPU && algosSupportsGPU) {
					if (GPUs.filter(gpu => minerData.algos.filter(algo => gpu.algos.includes(algo)).length > 0).length != GPUs.length) {
						minerList.push({
							name: `${minerData.miner} ${chalk.yellow("(Not supported by some of your GPUs)")}`,
							value: minerData
						});
					} else {
						minerList.push({
							name: minerData.miner,
							value: minerData
						});
					}
				}
			}
			if (minerList.length == 0) {
				spinner.stop();
				console.log(chalk.bold.red("No miners are available for your machine D:\nIf you think this is a mistake, talk to us on our Discord server."));
				setTimeout(() => {
					require("./index").menu();
				}, 6000);
			} else {
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
                downloadFile(downloadURL, fileLocation, fileName).then(async () => {
                    spinner = ora(`Extracting ${miner.miner.miner}-${miner.miner.version}`).start();
                    await extractFile(fileLocation, fileName, fileExtension)
				});
			}
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