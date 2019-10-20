import Discord, { Message, TextChannel, VoiceChannel } from "discord.js";
import Format from "string-template";
import Config from './config/config.json';
import Messages from './config/messages.json';

export class Bot {

    private readonly LEVEL_FIRST_JOIN:number = 0;
    private readonly LEVEL_JOIN:number = 1;
    private readonly LEVEL_JOIN_DISCONNECT:number = 2;

    private client:Discord.Client;
    private textChannel:TextChannel = null;
    private notificationLevel:number;
    private ttsEnabled:boolean;

    constructor (){
        this.notificationLevel = Config.notificationLevel;
        this.ttsEnabled = Config.ttsEnabled;
    }

    public start() {
        this.client = new Discord.Client();
        this.client.on("ready", () => {
            console.log("Connected");
            if(Config.defaultTextChannel !== null && Config.defaultTextChannel !== undefined){
                let channels = this.client.channels.filter(channel => channel instanceof TextChannel && channel.name === Config.defaultTextChannel);
                if(channels.size === 1){
                    this.textChannel = <TextChannel>channels.first();
                    console.log("Bot started in channel "+this.textChannel.name)
                    if(!Config.silentStartup){
                        this.textChannel.send(Format(Messages.botStartedInChannel, {channel: this.textChannel.name}));
                    }
                }else{
                    console.log("A default \""+Config.defaultTextChannel+"\" text channel is configured, but can't get it.")
                }
            }
        });

        this.client.on("message", (message: Message) => {
            if (message.content.charAt(0) === "%") {
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
            if(this.textChannel !== null && !oldMember.user.bot && !newMember.user.bot){
                if(newMember.voiceChannel !== undefined && !this.isChannelInBlacklist(newMember.voiceChannel)) {
                    if(oldMember.voiceChannel === undefined){
                        // User joined a voice channel
                        if(this.notificationLevel !== this.LEVEL_FIRST_JOIN || newMember.voiceChannel.members.size === 1){
                            this.textChannel.send(Format(Messages.userJoinsChannel, {user: newMember, voiceChannel: newMember.voiceChannel.name}), {
                                tts: this.ttsEnabled
                            });
                        }
                    }else if(newMember.voiceChannel.id !== oldMember.voiceChannel.id){
                        // User moved to another voice channel
                        if(this.notificationLevel !== this.LEVEL_FIRST_JOIN || newMember.voiceChannel.members.size === 1){
                            this.textChannel.send(Format(Messages.userChangesChannel, {user: newMember, voiceChannel: newMember.voiceChannel.name}), {
                                tts: this.ttsEnabled
                            });
                        }
                    }
                } else if(this.notificationLevel === this.LEVEL_JOIN_DISCONNECT  && newMember.voiceChannel === undefined 
                    && oldMember.voiceChannel !== undefined && !this.isChannelInBlacklist(oldMember.voiceChannel)){
                    // User disconnect
                    this.textChannel.send(Format(Messages.userDisconnectsChannel, {user: oldMember, voiceChannel: oldMember.voiceChannel.name}), {
                        tts: this.ttsEnabled
                    });
                }
            }
        });
        
        console.log("Login...");
        this.client.login(Config.token);
    }

    private isChannelInBlacklist(voiceChannel:VoiceChannel):boolean {
        return Config.blacklist.length > 0 && Config.blacklist.includes(voiceChannel.name);
    }

    private sendHelpMessage(message:Message){
        message.channel.send(Messages.helpMessage);
    }

    private startCommand(message:Message){
        if(this.textChannel === null){
            this.textChannel = <TextChannel>message.channel;
            message.channel.send(Format(Messages.botStartedInChannel, {channel: this.textChannel.name}));
        }else{
            message.channel.send(Format(Messages.botAlreadyInitializedInChannel, {channel: this.textChannel.name}));
        }
    }

    private stopCommand(message:Message){
        if(this.textChannel === null){
            message.channel.send(Messages.botNotInitialized);
        }else{
            this.textChannel = null;
            message.channel.send(Messages.botStopped);
        }
    }

    private setNotificationLevelCommand(message:Message){
        let notificationLevel:number = Number(message.content.split(" ")[1]);
        if(Number.isInteger(notificationLevel) && notificationLevel <= 2){
            this.notificationLevel = notificationLevel;
            message.channel.send(Format(Messages.notificationLevelSetTo, {notificationLevel: this.notificationLevel}));
        }else{
            message.channel.send(Format(Messages.invalidNotificationLevel, {notificationLevel: notificationLevel}));
        }
    }

    private setTTSCommand(message:Message){
        let ttsEnabled:string = message.content.split(" ")[1];
        if(ttsEnabled === "true"){
            this.ttsEnabled = true;
            message.channel.send(Messages.ttsEnabled);
        }else if(ttsEnabled === "false"){
            this.ttsEnabled = false;
            message.channel.send(Messages.ttsDisabled);
        }else{
            message.channel.send(Messages.invalidCommandArguments);
        }
    }
}