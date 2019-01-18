# VCCN Discord bot
**Voice channel connections notification Discord bot**

This bot sends a message when a user is connected to a voice channel in the text channel that has been started.

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

### Set up bot token
Get the bot token from the Discord Developer Portal and configure It in a new file src/config/auth.json:
```json
{
    "token":"YOUR_TOKEN_HERE"
}
```

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
