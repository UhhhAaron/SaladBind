# SaladBind

If you want to contribute to SaladBind, please read our [contributing guide](CONTRIBUTING.md).

## Table of Contents

[About](#About) <br>
[Installation](#Installation) <br>
[Configuration](#Configuration) <br>
[Miner Setup Guide](#Miner-Setup-Guide) <br>
[Compiling](#Compiling)

## About

**This application is not affiliated with Salad Technologies.** It is made by Vukky Limited, for the entire Salad community.

*BIND-ing* the good features from other projects together! (and fucking nuke the bad ones)

It's like if CLI and CLI+ had a baby: Switch between miners, pools, **and algorithms** with ease using a fancy UI and some brand-new extras, like an interactive configuration editor built right in to the program; **no website needed**!

And the best part: It's **open-source**! We also never use your token, except for **once** in the configuration process. Using your token, you are able to get your Rig ID automatically! Once you've done that, **never again**. You will never have to enter your token again, and we don't store it either! But you don't have to give your token, you can enter your Rig ID manually too! Security first!

Oh, and did we mention the **insane data savings**? SaladBind downloads miners on demand, so there's no need to download 460MB of miners that you'll never use, and you don't have to install Python, Java, or anything else on your computer. Just download SaladBind, and you're good to go - it's only **40-50MB**!

Oh and one last thing, did we mention it's **not-for-profit**? We don't any have hidden fees and pools. **We will never take any of your hard-earned money from you.**

**Welcome to the next generation of Salad CLIs!**

## Installation

Head to our [GitHub Releases](https://github.com/VukkyLtd/SaladBind/releases/latest) page, download the latest release for your operating system, and run it. **BUT KEEP READING!**

### Platform-specific prequisites

#### macOS & Linux

If you are on macOS or Linux, please note that these platforms are untested and you may encounter bugs. You need to make SaladBind executable using chmod.
```bash
chmod +x ./saladbind-macos
```
```bash
chmod +x ./saladbind-linux
```

On those platforms, you'll have to run SaladBind from the terminal like this, respectively:

```bash
./saladbind-macos
```

```bash
./saladbind-linux
```

#### Windows 7

**SaladBind does not by default support Windows 7. Only use these steps if you know what you are doing.**

However, [you can make a bat file](https://www.wikihow.com/Write-a-Batch-File#Saving-the-Batch-File) with Notepad in the same location as SaladBind to allow it to run, and use it to open SaladBind instead of the exe.

```bat
set NODE_SKIP_PLATFORM_CHECK="1"
saladbind-win
```

### Configuration

Once you start SaladBind for the first time, it'll prompt you to enter your mining details.

You can do this by letting SaladBind search your log file, entering your Salad Auth token, which grabs your Rig ID automatically, or you can enter your Rig ID manually.

#### Automatic (Read from Salad logs)

SaladBind will search your Salad's log file for your Rig ID and save it automatically.

1. Mine for 5-15 minutes (Chopping stage)
2. Choose Automatic (Read from Salad logs)

#### Automatic (Get with Salad Auth token)

You will be prompted to enter your access token. It is recommended to use a Chromium-based browser like Google Chrome or the new Microsoft Edge.
To get your access token follow these steps:

1. Log in to [https://app.salad.io/](https://app.salad.io)
2. Click the lock symbol in the address bar
3. Open `Cookies` and uncollapse `app-api.salad.io`
4. Look for `sAccessToken` and copy it (right click and click `Select all` as it is very long)
5. Paste the token into the terminal (on Windows, right-click in the SaladBind window to paste)

#### Manual

1. Start mining with the Salad app normally
2. Mine for around 5-15 minutes (the "Chopping" stage)
3. Find your Salad logs. A guide can be found [here](https://support.salad.com/hc/en-us/articles/360042215512-How-To-Find-Your-Salad-Log-Files)
4. Search for "rig ID" in the main.log file and copy it. Both Ethermine worker ID and Nicehash rig ID are supported
5. Paste the Rig ID into the terminal (on Windows, right-click in the SaladBind window to paste)

You are now ready to go!

### Miner Setup Guide

If you don't know what miner, algorithm or pool to pick, we have a [handy guide](MINERS.md).

## Compiling

If you don't want to use our pre-compiled binaries you can compile SaladBind yourself. You'll need to install [Node.js](https://nodejs.org/).

1. Clone the repository
2. Open a terminal in the folder and run `npm install`
3. Run `npm run compile` (This may display a warning, but it's safe to ignore it)
4. Your compiled binary will be in the `bin` folder
