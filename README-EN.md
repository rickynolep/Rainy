# Usage
If you want to contribute to this project, scroll again until you reach "Developtment" section. If you just want to use this, continue reading buddy!

## Preperations
To use this bot you need to at least have:
- Device connected to internet and have command line
- [Bun v1.2](https://bun.sh/) or [Node v18+](https://nodejs.org/en) installed on the device
- [Optional] Git installed on the device
- Discord Bot Credentials (Token, Client ID)
- Gemini API Key
- Basic knowledge on how to use command line, managing files, and editing configurations files.

And have this as optional preference: 
- osu! API Credentials - To enable osu! intergrations

<br>

<details>
    <summary>Learn how to get Discord Bot Credentials</summary>
    <br>
    To Do!
</details>

<details>
    <summary>Learn how to get Gemini API Key</summary>
    <br>
    To Do!
</details>

## Setup
After preperations are done first you need clone this repository and enter your project folder:
```sh
git clone https://github.com/rickynolep/rainy.git
cd Rainy
```
If you can't or don't want to install git on your device, you can also download this repository manually.

### Changing required credentials

Next you should see a file called ``.env.example``
<details>
    <summary>No, I dont see anything called .env.example</summary>
    If you don't see the file, please make sure you enable "Show hidden files" on your device and project cloning are successfully finished without error, if somehow it still missing, please retry the previous step!
    <br><br>
</details>
<details>
    <summary>I only see ".env" files, not ".env.example"</summary>
    That probably means your device hide the file extension, please enable it before continue!
    <br>
</details><br>

Open that file and fill it with the nessesary credentials, PLEASE TAKE CARE OF THIS FILE because it will contain your private bot password that any person can use to control your bot. After you finished filling the credentials, rename that files into ``.env`` by removing ".example" on behind

### Building the Bot
Finally you need to build this project. Seems hard eh? Not really, for this project all you need to is just run this:
```sh
bun buildbot
```
Or this on NodeJS:
```sh
npx tsc; node archiver.js
```

After the process are done a new folder called `export` will be created that contains a zip of your bot script, you can copy this anywhere you want and unzip it to run them

### Bonus: Running the bot
You can run this bot on your local device or on VPS Panel that support Bun / NodeJS<br>
To run it on your local device you should run:
```sh
bun index.js
# OR
node index.js
```
If you run it on a VPS Panel the process should be done automatically and no changes need to be made (except unzipping the file) but if the bot stuck at ``[I] Reloading all cofigurations...`` for more than 30 seconds try to enable ``compatibilityMode`` on the ``config.yaml`` file.
<br><br><br>
# Developtment
## Preperations
To contribute on this project you need to have at least:
- Device / Service with IDE capability
- [Bun v1.2](https://bun.sh/) installed and supported
- [Optional] Git installed and supported
- Discord Bot Credentials (Token, Client ID)
- Gemini API Key
- TypeScript knowledge

And have this as optional preference: 
- osu! API Credentials - To enable osu! intergrations

<br>

<details>
    <summary>Learn how to get Discord Bot Credentials</summary>
    <br>
    To Do!
</details>

<details>
    <summary>Learn how to get Gemini API Key</summary>
    <br>
    To Do!
</details>

## Cloning this Repository
After preperations are done first you need clone this repository and enter your project folder:
```sh
git clone https://github.com/rickynolep/rainy.git
cd Rainy
```
If you can't or don't want to install git on your device, you can also download this repository manually. After sucessfully cloning repository without any errors you should filling ``.env.example`` with actual credentials and renaming it into ``.env`` file.

## Running this project
After making sure everything went well, to run the bot run:
```sh
bun dev
```
Keep in mind after building the bot you need to use ``bun index.js`` to start it since after build, the src folder will be gone!

## Building the Bot
To build this project into a simple zip files, you can just do:
```sh
bun buildbot
```
Simple isn't it? Anyway thanks for actually reading this far!
<br><br><br>

# Server and Contributions
Pull request is accepted and this project really need contributions since im working alone since March 2024, you can join my [Discord Server](https://discord.com/invite/pAxmeD3kDj) if you had any question on this project or need help about it.

If you also want to contribute to this project you can donate me at https://trakteer.id/rickynolep. I will really appreciate it even if it as little as 1$!