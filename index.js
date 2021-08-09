const ora = require('ora'); // ara ara
const chalk = require('chalk');
const packageJson = require('./package.json');
const fs = require('fs');
const inquirer = require('inquirer');
const fetch = require("node-fetch");
const open = require("open");
const si = require("systeminformation");
const update = require("./update.js")
const presence = require("./presence.js");

process.on("uncaughtException", err => { try { return } catch { return } })

presence.state.on('ready', () => {
	presence.enable();
	presence.mainmenu();
	process.on("uncaughtException", err => {
		try {
			console.log(chalk.bold.red("An unexpected error occured! Technical details:\n" + err.message));
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
					}
				]
			}).then(out => {
				if (out.exit == "exit") process.exit(1)
				else if (out.exit == "write_log") {
					fs.writeFileSync("saladbind_error.txt", `An error occured.\nError: ${err}\n\nStacktrace: ${err.stack}`);
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
})


var CLImode = false;
var CLIArgs = []
console.clear();
process.title = `SaladBind v${packageJson.version}`;
if (process.argv[2]) {
	CLImode = true
	CLIArgs = process.argv.slice(2);
}



(async() => {
	update.updateCheck.then(() => {
		if (!CLImode) {
			console.log(chalk.bold.green(`SaladBind v${packageJson.version}`))
			if (!fs.existsSync('./data/config.json')) {
				console.log("Looks like this is your first time using SaladBind!\nLet's set it up. :)\n");
				require("./setup").run(false);
			} else {
				menu();
			}
		} else {
			CLIMode()
		}
	})
})();

async function CLIMode() {
	console.log(CLIArgs)
	if (CLIArgs[0] == "-help") {
		console.log(chalk.green(`SaladBind CLI v${packageJson.version}`));
		console.log("Arguments:")
		console.log(`
	-help 	Display this help message

	-miner	Choose miner (for example: "phoenixminer") (REQUIRED)

	-algo	Choose algorithm (for example: "ethash") (REQUIRED)

	-pool	Choose pool (for example: "nicehash") (REQUIRED)

	-wallet	Choose wallet (for example: "0x6ff85749ffac2d3a36efa2bc916305433fa93731.123123123123123")

	-advanced	Choose advanced settings (for example: "-advanced [-w a -u 123 ]")
				Anything put inside these square brackets will be passed to the miner directly.
		`);
	}
}


async function menu(clear) {
	if (clear == undefined || clear == true) {
		console.clear();
	}
	presence.mainmenu();
	console.log(chalk.bold.green(`SaladBind v${packageJson.version}`));
	const questions = [{
		type: 'list',
		name: 'menu',
		message: 'What would you like to do?',
		choices: [{
				name: 'Start mining',
				value: 'mining'
			},
			{
				name: 'Configure SaladBind',
				value: 'config'
			},
			{
				name: 'Join the SaladBind Discord',
				value: 'discord'
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
			presence.configuring()
			require("./mining").run();
			break;
		case 'config':
			presence.configuring()
			require("./setup").run();
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
