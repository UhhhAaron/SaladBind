const ora = require('ora');
const chalk = require('chalk');
const fetch = require("node-fetch");
const packageJson = require('../package.json');
const inquirer = require('inquirer');
const fs = require("fs")
const https = require('https');
const { exec } = require('child_process');
const si = require("systeminformation");

if (!fs.existsSync("./data")) {
	fs.mkdirSync("./data");
}

const updateCheck = new Promise((resolve, reject) => {
		let dirCont = fs.readdirSync("./");
		let instances = []
		var i = 0;

		for (i = 0; i < dirCont.length; i++) {
			if (dirCont[i].toLowerCase().includes("saladbind") || dirCont[i].toLowerCase().includes("salad bind")) {
				instances.push(dirCont[i])
			}
		}
		if (instances.length > 1) {
			setTimeout(function() {
				for (i = 0; i < instances.length; i++) {
					fs.unlink(`./${instances[i]}`, function() {})
				}
			}, 5000)
		}
		let updateFailed = false;
		let timer = setTimeout(() => {
			spinner.fail("Could not search for updates!")
			setTimeout(() => resolve(), 3000);
		}, 10000);

		const spinner = ora('Checking for updates...').start();
		fetch('https://raw.githubusercontent.com/VukkyLtd/SaladBind/main/internal/changelog.json')
			.then(res => res.json())
			.then(data => {
				clearTimeout(timer);
				if(updateFailed) return; // to not mess up stuff if it recovers
				version = data.version
				files = { //files to download if the user decides to autoupdate.
					"win32": { "file": `https://github.com/VukkyLtd/SaladBind/releases/download/v${version}/saladbind-win.exe`, "name": `SaladBind-win-${version}.exe` },
					"linux": { "file": `https://github.com/VukkyLtd/SaladBind/releases/download/v${version}/saladbind-linux`, "name": `SaladBind-linux-${version}` },
					"darwin": { "file": `https://github.com/VukkyLtd/SaladBind/releases/download/v${version}/saladbind-macos`, "name": `SaladBind-macos-${version}` }
				}
				if (version !== packageJson.version) {
					spinner.succeed(chalk.bold.green(`SaladBind ${data.version} is available!`));
					data.changelog.forEach(item => {
						console.log(`- ${item}`)
					});
					console.log();
					inquirer.prompt({
						name: "updatePrompt",
						message: "What do you want to do?",
						type: "list",
						choices: [{
								name: "Remind me later",
								value: "remindlater"
							},
							{
								name: "Automatically install update",
								value: "auto"
							}
						]
					}).then(out => {
						if (out.updatePrompt == "remindlater") resolve();
						else if (out.updatePrompt == "auto") {
							startUpdate();
						}
					})

				} else {
					spinner.stop();
					resolve();
				}

			})

	})
	.catch(err => {
		spinner.fail(chalk.bold.red(`Could not check for updates, please try again later.`));
		console.log(err);
		setTimeout(() => {
			resolve();
		}, 3500);

	});


async function startUpdate() {
	spinner = ora(`Downloading SaladBind v${version}`).start();
	path = `/data/`
	temp = await si.osInfo()
	platform = temp.platform
	if (platform == "win32") {
		filename = files.win32.name
		downloadFile(files.win32.file, `./${path}${filename}`, `SaladBind v${version}`)
	} else if (platform == "linux") {
		filename = files.linux.name
		downloadFile(files.linux.file, `./${path}${filename}`, `SaladBind v${version}`)
	} else if (platform == "darwin") {
		filename = files.macos.name
		downloadFile(files.macos.file, `./${path}${filename}`, `SaladBind v${version}`)
	}
}




const downloadFile = async function(url, location, name) {
	return new Promise(async(resolve, reject) => {
		const stream = fs.createWriteStream(location);
		const request = https.get(url, function(response) {
			if (parseInt(response.statusCode) >= 200 && parseInt(response.statusCode) < 300) {
				response.pipe(stream);
				stream.on('finish', function() {
					stream.close(function() {
						spinner.succeed(chalk.bold.green(`Downloaded ${name}`));
						installNew(location)
					});
				});
			} else {
				downloadFile(response.headers.location, location, name).then(() => {
					return
				});
			}
		});
	});
}


const installNew = async function(location) {
	spinner = ora(`Installing SaladBind v${version}. Please Wait`).start();
	fs.copyFile(`.${path}${filename}`, `./${filename}`, function() {
		fs.unlink(`.${path}${filename}`, function() {
			setTimeout(function() {
				if (platform == "win32") {
					spinner.succeed(chalk.bold.green(`${filename} has been downloaded! Opening in 5 seconds.`));
					setTimeout(function() {

						exec(`start ${filename}`, () => {

						})
						console.log(chalk.bold.red("Closing this window. Please do not touch anything until instructed."))
						setTimeout(function() { process.exit(0) }, 5000)

					}, 5000)

				} else {
					spinner.succeed(chalk.bold.green(`${filename} has been downloaded! You may now close this window.`)); //i dont have a linux or macos machine so idk how to open new processes on them.

				}
			}, 1000)
		})
	})




}





module.exports = {
	updateCheck,
}
