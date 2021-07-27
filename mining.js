const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const fetch = require("node-fetch");
const si = require("systeminformation");
const https = require('https');
const path = require('path');
const extract = require('extract-zip');
const tar = require('tar');
const mv = require('mv'); //what i forogt to save :bukky:
let spinner;

function moveDupeFolder(folderName) {
	let folderData = fs.readdirSync(`./data/miners/${folderName}`)
	if(folderData.length == 1) {
		mv(`./data/miners/${folderName}/${folderData[0]}`, `./data/miners/${folderName}`, {clobber: false}, function(err) { //oh okers
			// done. it tried fs.rename first, and then falls back to
			// piping the source file to the dest file and then unlinking
			// the source file. (docs lol) lol
			if(err) {
				console.log(chalk.bold.red(err));
				spinner.fail();
			}
		});
	}
}

async function extractFile(location, folderName, fileExtension) {
    if (!fs.existsSync(`./data/miners/${folderName}`)){
		fs.mkdirSync(`./data/miners/${folderName}`); // me too
	}
	switch (fileExtension) {
		case ".zip":
    		await extract(require('path').resolve(location), { dir: path.resolve(`./data/miners/${folderName}`) });
			fs.unlinkSync(location);
			moveDupeFolder(folderName);
		break;
		case ".tgz":
		case ".tar.gz":
			fs.createReadStream(location).pipe(
				tar.x({
				  strip: 0,
				  C: path.resolve(`./data/miners/${folderName}`),
				  filter: function(path, entry) {
				    return !path.endsWith('.sh') && !path.endsWith('.bat') && !path.endsWith('.md'); //how would we go about this for extract thoughh? can't find anything since it wraps the yauzl stuff
				  },
				  sync: true
				})
			).on("end", () => {
				fs.unlinkSync(location)
				moveDupeFolder(folderName);
			})
		break;
	}
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
                    });
                });
            } else {
                downloadFile(response.headers.location, location, name).then(() => {
					resolve();
				});
			}
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
	fetch('https://raw.githubusercontent.com/VukkyLtd/SaladBind/main/internal/miners.json?token=ALJSKC424AHDPQ7QYTVKBA3BAAAYA') //fuck you token
		.then(res => res.json())
		.then(async data => {
			spinner.stop();
			let minerList = [];
			let temp = await si.osInfo()
			let temp2 = await si.graphics()
			let userPlatform = temp.platform;
			let GPUs = [];  
			for (let i = 0; i < temp2.controllers.length; i++) {
				let compatibleAlgos = []
				for (let j = 0; j < Object.keys(data.algos).length; j++) {
					if(temp2.controllers[i].vram > data.algos[Object.keys(data.algos)[j]]) { 
						compatibleAlgos.push(Object.keys(data.algos)[j]) // no, we'd have to flip it around i think
					} //wait no am i having a stroke so its the amount of supported algos yupp ok very cool!
				} // 
				if (compatibleAlgos.length > 0) {
					GPUs.push({"algos": compatibleAlgos, "vendor": temp2.controllers[i].vendor.toLowerCase()});
				}
				GPUs.push({"algos": ["etchash", "kawpow"], "vendor": "nvidia"}); //fake gpu right here (yeah but your real one makes ethash show up) indeed
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
				if(!fs.existsSync(`./data/miners/${miner.miner.miner}-${miner.miner.version}`)) {
					spinner = ora(`Downloading ${miner.miner.miner}-${miner.miner.version}`).start();
					let miners = fs.readdirSync("./data/miners");
					let oldMiners = miners.filter(miner => miner.startsWith(miner.miner.miner));
					if(oldMiners.length > 0) { //woo! time for pools.json (and more fucking tokens) oh piss
						oldMiners.forEach(miner => fs.unlinkSync(`./data/miners/${miner}`));
					}
					var downloadURL = miner.miner.download[userPlatform];
					var fileExtension = path.extname(downloadURL); //time for a really hacky solution
					if (fileExtension == ".gz") {
						fileExtension = ".tar.gz"
					}
					const fileName = `${miner.miner.miner}-${miner.miner.version}`
					const fileLocation = `./data/miners/${fileName}${fileExtension}`; 
					downloadFile(downloadURL, fileLocation, fileName).then(async () => {
						spinner = ora(`Extracting ${miner.miner.miner}-${miner.miner.version}`).start();
						await extractFile(fileLocation, fileName, fileExtension)
						selectAlgo(miner.miner, GPUs);
					});
				} else {
					selectAlgo(miner.miner, GPUs);
				}
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

async function selectAlgo(minerData, GPUs) {
	console.clear();
	console.log(chalk.bold.cyan(`Configure your miner`))
	let algoList = [];
	const gpuSupportsAlgo = minerData.algos.filter(algo => GPUs.filter(gpu => gpu.algos.includes(algo)).length > 0)
	const temptemp = GPUs.filter(gpu => minerData.algos.filter(algo => gpu.algos.includes(algo)).length > 0)
	for (let i = 0; i < gpuSupportsAlgo.length; i++) { //im having a really bhig stroke
		let notSupportedByAll;
		for (let j = 0; j < GPUs.length; j++) {
			if(!GPUs[j].algos.includes(gpuSupportsAlgo[i])) {
				notSupportedByAll = true;
			}
		}
		if (notSupportedByAll == true) { // now. the cursed. pool selection and miner running. ok pool selection is only needed if ethash is selected
			algoList.push({name: `${gpuSupportsAlgo[i]} ${chalk.yellow("(Not supported by some of your GPUs)")}`, value: gpuSupportsAlgo[i]});
		} else {
			algoList.push({name: gpuSupportsAlgo[i], value: gpuSupportsAlgo[i]});
		}
	} 
	const algo = await inquirer.prompt({
		type: "list", 
		name: "algo",
		message: "Choose an algorithm",
		choices: algoList
	});
	selectPool(minerData, algo.algo);
}

async function selectPool(minerData, algo) {
	spinner = ora("Loading pool list").start();
	fetch('https://raw.githubusercontent.com/VukkyLtd/SaladBind/main/internal/pools.json?token=ALJSKC424AHDPQ7QYTVKBA3BAAAYA') //fuck you token
		.then(res => res.json())
		.then(async poolData => {
			//just thinking of a "cool" way to do this ok ill push now
		}).catch(err => { //make this into something i can commit
			spinner.fail(chalk.bold.red(`Could not select a pool. Please try again later.`));
			console.log(err);
			setTimeout(() => {
				require("./index").menu();
			}, 3500);
		});
}

module.exports = {
	run
};