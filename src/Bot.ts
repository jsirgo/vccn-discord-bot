import Discord, { Message, TextChannel } from "discord.js";

export class Bot {

    private LEVEL_FIRST_JOIN:number = 0;
    private LEVEL_JOIN:number = 1;
    private LEVEL_JOIN_DISCONNECT:number = 2;

    private token:string;
    private client:Discord.Client;
    private textChannel:TextChannel = null;
    private notificationLevel:number = this.LEVEL_FIRST_JOIN;
    private ttsEnabled:boolean = false;

    constructor (token:string){
        this.token = token;
    }

    public start() {
        this.client = new Discord.Client();
        this.client.on("ready", () => {
            console.log("Connected");
        });
        this.client.on("message", (message: Message) => {
            if (message.content.charAt(0) == "%") {
                let cmd = message.content.substring(1).split(" ")[0];
                switch(cmd) {
                    case "help":
                        this.sendHelpMessage(message);
                    break;
                    case "start":
                        this.startCommand(message);
                    break;
                    case "stop":
                        this.stopCommand(message);
                    break;
                    case "level":
                        this.setNotificationLevelCommand(message);
                    break;
                    case "tts":
                        this.setTTSCommand(message);
                    break;
                }
            }
        });

        this.client.on("voiceStateUpdate", (oldMember, newMember) => {
            if(this.textChannel != null && !oldMember.user.bot && !newMember.user.bot){
               if(newMember.voiceChannel !== undefined) {
                    // User Join
                    if(this.notificationLevel != this.LEVEL_FIRST_JOIN || newMember.voiceChannel.members.size == 1){
                        this.textChannel.send("User: "+newMember+" conected to: "+newMember.voiceChannel+" voice channel", {
                            tts: this.ttsEnabled
                        });
                    }
                } else if(oldMember.voiceChannel !== undefined && this.notificationLevel == this.LEVEL_JOIN_DISCONNECT){
                    // User disconnect
                    this.textChannel.send("User: "+oldMember+" disconnected from: "+oldMember.voiceChannel+" voice channel", {
                        tts: this.ttsEnabled
                    });
                }
            }
        });
        
        console.log("Login...");
        this.client.login(this.token);
    }

    private sendHelpMessage(message:Message){
        message.channel.send("Help:"
        +"\n%start - Starts the bot in the text channel"
        +"\n%stop - Stops the bot"
        +"\n%level {0} - Notification level"
        +"\n\t"+this.LEVEL_FIRST_JOIN+" - Only notifies when the first user joins a voice channel (Default)"
        +"\n\t"+this.LEVEL_JOIN+" - Notifies when a user joins a channel"
        +"\n\t"+this.LEVEL_JOIN_DISCONNECT+" - Notifies when a user joins or disconnects from a channel"
        +"\n%tts {0} - Enable tts: false or true");
    }

    private startCommand(message:Message){
        if(this.textChannel == null){
            this.textChannel = <TextChannel>message.channel;
            message.channel.send("Bot started");
        }else{
            message.channel.send("Bot already initialized in channel: "+this.textChannel.name);
        }
    }

    private stopCommand(message:Message){
        if(this.textChannel == null){
            message.channel.send("Bot not initialized");
        }else{
            this.textChannel = null;
            message.channel.send("Bot stopped");
        }
    }

    private setNotificationLevelCommand(message:Message){
        let notificationLevel:number = Number(message.content.split(" ")[1]);
        if(Number.isInteger(notificationLevel) && notificationLevel <= 2){
            this.notificationLevel = notificationLevel;
            message.channel.send("Notification level set to: " + this.notificationLevel + " (Value will be reset to default if the bot is rebooted or stopped)");
        }else{
            message.channel.send("Invalid notification level");
        }
    }

    private setTTSCommand(message:Message){
        let ttsEnabled:string = message.content.split(" ")[1];
        if(ttsEnabled == "true"){
            this.ttsEnabled = true;
            message.channel.send("tts enabled (Value will be reset to default if the bot is rebooted or stopped)");
        }else if(ttsEnabled == "false"){
            this.ttsEnabled = false;
            message.channel.send("tts disabled (Value will be reset to default if the bot is rebooted or stopped)");
        }else{
            message.channel.send("Invalid command arguments");
        }
    }
}