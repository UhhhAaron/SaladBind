process.on("uncaughtException", err => {
	try {
		if(err.stack.includes("Could not connect") || err.stack.includes("RPC_") || err.stack.includes("discord-rpc")) {
			console.log("There was an error with the Discord RPC but it has been ignored. If you see this message and SaladBind is unusable, please contact us on Discord.")
			return "Discord RPC Broken I guess, as always"; // no one will see this message :)
		}
		console.clear();
		console.log(chalk.bold.red("An unexpected error occurred! Technical details:\n" + err.message));
		if(err.message.includes("EPERM")) console.log(chalk.blueBright("This could be your antivirus."))
		inquirer.prompt({
			name: "exit",
			message: "What do you want to do?",
			type: "list",
			choices: [{
					name: "Write to log and exit",
					value: "write_log"
				},
				{
					name: "Exit",
					value: "exit"
				},
				{
					"name": "",
					"value": ""
				}
			]
		}).then(out => {
			if (out.exit == "exit" || out.exit == "") process.exit(1)
			else if (out.exit == "write_log") {
				try {

					fs.writeFileSync("saladbind_error.txt", `An error occurred.\nError: ${err}\n\nStacktrace: ${err.stack}\n\nDebug: ${JSON.stringify(getDebugData(), null, " ")}`);
					process.exit(1);
				} catch {
					try {
						console.log("Could not get data/write to file, heres some debug data that can help you")
						console.log(err.stack)
						console.log(JSON.stringify(getDebugData()));
						setInterval(() => {
							// literally do nothing, make sure the user sees the error and it doesnt close instantly
						}, 10000);
					} catch {

					}
				}
				process.exit(1);
			}
		})
	} catch (newError) {
		console.log("ERROR: ", {
			err,
			newError
		});
		process.exit(1);
	}
});

const ora = require('ora'); // ara ara
const chalk = require('chalk');
const packageJson = require('../package.json');
const fs = require('fs');
const inquirer = require('inquirer');
const fetch = require("node-fetch");
const open = require("open");
const si = require("systeminformation");
const update = require("./update.js")
const presence = require("./presence.js");

function getDebugData() {
	let configTest;
	if(fs.existsSync("./data/config.json")) {
		try {
			configTest = JSON.parse(fs.readFileSync("./data/config.json").toString());
		} catch {
			configTest = "Error while reading/parsing"
		}
	} else {
		configTest = "None"
	}
	let miners;
	try {
		miners = fs.readdirSync("./data/miners").join(", ")
	} catch {
		miners = "Error, data/miners folder might not exist or is unreachable."
	}
	return {
		configured: fs.existsSync("data/config.json"),
		__dirname: __dirname,
		cwd: process.cwd(),
		version: packageJson.version,
		config: config,
		discordRPC: {
			connected: typeof presence?.state?.user?.username != "undefined",
			user: presence?.state?.user?.username
		},
		platform: process.platform,
		miners: miners
	}
}
presence.state.on('ready', () => {
	presence.enable();
	presence.mainmenu();
})


console.clear();
const aprilfools = new Date().getMonth() == 3 && new Date().getDate() == 1;
process.title = `${aprilfools ? "VegetableJoiner" : "SaladBind"} v${packageJson.version}`;

// Make sure the user doesn't run SaladBind as admin or from Start menu on Windows
function startMenuCheck() {
	if(process.platform == "win32" && (__dirname.toLowerCase().startsWith("c:\\windows\\system32") || process.cwd().toLowerCase().startsWith("c:\\windows\\system32")) ) {
		console.log(chalk.red.bold("Warning: You are running SaladBind from the task menu or as administrator.\nPlease run SaladBind from the SaladBind exe file you downloaded in order to avoid issues."))
	}
}
(async() => {
	update.updateCheck.then(() => {
			if (!fs.existsSync('./data/config.json')) {
				require("./setup").run(false);
			} else {
				console.log(chalk.bold.green(`SaladBind v${packageJson.version}`));
				console.clear();
				startMenuCheck();
				menu(false);
			}
	})
})();

async function menu(clear) {
	if (clear == undefined || clear == true) {
		console.clear();
	}
	presence.mainmenu();
	console.log(chalk.bold.green(`${aprilfools ? "VegetableJoiner" : "SaladBind"} v${packageJson.version}`));
	const questions = [{
		type: 'list',
		name: 'menu',
		message: 'What would you like to do?',
		choices: [{
				name: 'Start mining',
				value: 'mining'
			},
			{
				name: 'Reconfigure SaladBind',
				value: 'config'
			},
			{
				name: 'Join the SaladBind Discord',
				value: 'discord'
			},
			{
				name: 'What\'s new?',
				value: 'changes'
			},
			{
				name: 'Exit SaladBind',
				value: 'exit'
			}
		]
	}];
	const answers = await inquirer.prompt(questions);
	switch (answers.menu) {
		case 'mining':
			require("./mining").run();
			break;
		case 'config':
			presence.configuring("Changing settings")
			require("./setup").run();
			break;
		case 'changes':
			presence.configuring("Reading the changelog")
			const spinner = ora('Fetching the Changelogs').start();
			fetch('https://raw.githubusercontent.com/LITdevs/SaladBind/main/internal/changelog.json')
				.then(res => res.json())
				.then(data => {
					console.clear();
					spinner.succeed(chalk.bold.green(`What's new in the latest update - ${data.version}`));
					data.changelog.forEach(item => {
						console.log(`- ${item}`)
					});
					console.log();
					inquirer.prompt({
						type: 'input',
						name: 'backtomenu',
						message: 'Press ENTER to return to the menu.'
					}).then(function() {
						menu();
					});
				})
			break;
		case 'discord':
			let temp = await si.osInfo()
			if (temp.platform == "linux") {
				console.log("\nhttps://discord.gg/HfBAtQ2afz");
			} else {
				open("https://discord.gg/HfBAtQ2afz");
				console.log("\nOpened the invite in your browser!");
			}
			setTimeout(() => {
				menu();
			}, 3500);
			break;
		case 'exit':
			console.clear();
			process.exit(0);
		default:
			menu();
			break;
	}
}

module.exports = {
	menu
}
