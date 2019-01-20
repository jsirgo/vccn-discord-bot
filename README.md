# VCCN Discord bot
**Voice channel connections notification Discord bot**

This bot sends a message when a user is connected to a voice channel in the text channel that has been started.

This code is only intended to work in a private bot, it is not suitable to work for multiple discord servers with a single bot.

## Commands
* **help** - Shows the command list
* **start** - Starts the bot in the text channel (It can not be used on more than one channel at a time)
* **stop** - Stops the bot in the text channel
* **level {0}** - Notification level
    * **0** - Notifies when the first user joins the channel (Default)
    * **1** - Notifies when a user joins a channel
    * **2** - Notifies when a user joins or disconnects from a channel
* **tts {0}** - Enables text to speech to read the notification messages: false or true

## Requirements
Node.js

### Install node dependencies
Install dependencies:
```shell
npm install
```

### Set up bot configuration
1. Copy the example configuration file and rename it from /example-config.json to /src/config.json and edit the configuration as you need:
* **token:** Get the bot token from the Discord Developer Portal and paste it here.
* **notificationLevel:** number from 0 to 2:
    * **0** - Notifies when the first user joins the channel (Default).
    * **1** - Notifies when a user joins a channel.
    * **2** - Notifies when a user joins or disconnects from a channel.
* **ttsEnabled:** Enables text to speech to read the notification messages: false or true.
* **defaultTextChannel:** By default it is null, the bot will not start automatically in any text channel, for this it will be necessary to use the% start command in the desired channel. If you want the bot to start automatically in a channel modify null by a string with the name of the desired channel *"name of channel"*.
* **blacklist:** You can keep it as an empty array *[]* or configure the voice channel names that you won't to be notified *["name of channel a","name of channel b"]*

2. Copy the example messages file and rename it from /example-messages.json to /src/messages.json and edit the messages as you need.

### Build and run
Build the code:
```shell
npm run build
```
Run the bot:
```shell
npm start
```

### Run docker image
To build the image:
```shell
docker build -t vccn .
```
To run the docker image:
```shell
docker run -d vccn
```

### Add bot to discord server
Replace the {CLIENT_ID} in the url with the application client id from the Discord Developer Portal and open the url:
https://discordapp.com/oauth2/authorize?client_id={CLIENT_ID}&scope=bot&permissions=6144
