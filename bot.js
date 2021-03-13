const Mineflayer = require('mineflayer');
const DiscordJS = require('discord.js');
const config = require('./config/config.json');
const silencedMsgs = require('./config/silenced-msgs.json')['silenced-messages'];
const discord = new DiscordJS.Client();
const mc = Mineflayer.createBot({
    host: config.minecraft.server.address,
    port: parseInt(config.minecraft.server.port),
    username: config.minecraft.username,
    password: config.minecraft.password,
    version: config.minecraft.server.version,
    auth: config.minecraft.authType
});
mc.settings.viewDistance = "tiny";

function log(message, discord) {
    if (discord) {
        channel.send("`" + message + "`");
        console.log("Minecraft: " + message);
    } else {
        channel.send(message);
        console.log(message);
    }
};

limboCmd = false;

discord.on('ready', () => {
    console.log(`Logged into Discord as ${discord.user.username}.`);
    channel = discord.channels.cache.get(config.discord.channelID);
    if (!channel) {
        console.log("Couldn't find the channel specified in config.json.\nMake sure your ID is valid or that you didn't copy something else in, then try again.")
        process.exit(1);
    }

});

discord.on('message', message => {
    if (message.channel.id !== channel.id) return;
    if (message.author.id === discord.user.id) return;

    if (message.content == "!limbo") {
        log("Sending to limbo.");
        limboCmd = true;
        mc.chat("/achat \u00a7c<3");
    } else if (message.content == "!play") {
        log("Sending to Party Games.");
        mc.chat("/play arcade_party_games_1");
    } else if (message.content == "!quit") {
        log("Going offline.");
        mc.quit();
        process.exit(0);
    } else mc.chat(message.toString());

});

mc.on('login', () => {
    log("Logged into Minecraft.");
    inGame = false;
});

mc.on('kicked', (reason, loggedIn) => {
    log("**Kicked from game:** " + reason + loggedIn, false);
    process.exit(0);
});

mc.on('end', () => {
    log("**Disconnected for unknown reason.**");
    process.exit(0);
});

mc.on('error', err => {
    console.log(err);
    channel.send("Error occurred - check console for more info.\n```\n" + message + "\n```");
    process.exit(1);
});

mc.on('message', (message) => {
    message = message.toString();
    silence = false;

    silencedMsgs.forEach(entry => {
        if (message.includes(entry)) silence = true;
        return;
    })

    if (message.includes("you have been routed to limbo")) limboCmd = false;
    else if (limboCmd) {
        silence = true;
        mc.chat("/achat \u00a7c<3");
    }

    if (message.includes("Something went wrong trying to send you to that server! If this keeps happening please report it!")) {
        log("Sending to game failed, sending to limbo. Will try re-joining in one minute.")
        limboCmd = true;
        mc.chat("/achat \u00a7c<3");
        setTimeout(() => {
            log("Sending to Party Games.");
            mc.chat("/play arcade_party_games_1");
        }, 60000);
    }

    if (config.extras.hypixelAutoGG.enabled && (message.includes("Your game was boosted by") || message.includes("1st Place - "))) {
        setTimeout(() => {
            mc.chat("/ac gg")
        }, config.extras.hypixelAutoGG.interval);

        setTimeout(() => {
            mc.chat("/tip all")
        }, 5000);
    }

    if (!silence && message.replace(/\s/g, '').length) {
        log(message, true)

        if (message.includes("The game starts") || message.includes("The game is starting in ")) {
            inGame = true;
        } else if (message.includes("     Looks like no one won. :(")) {
            log("Detected broken or empty game. Sending play command.");
            mc.chat("/play arcade_party_games_1");
        } else if ((message.includes(" joined the lobby!") && message.includes("[MVP+")) 
        || message.includes("You are currently NICKED") 
        || (message.includes("[Mystery Box] ") && message.includes(" found a")) 
        || (message.includes("Couldn't connect you to that server") && !(message.includes("limbo"))) 
        || message.includes("unclaimed leveling rewards!")) {
            inGame = false;
            if (config.extras.hypixelAutoMatch.enabled) {
                log("Detected to be in lobby, sending to game.");
                mc.chat("/play arcade_party_games_1");
            } else {
                log("Detected to be in lobby, sending to limbo.");
                mc.chat("/achat \u00a7c<3");
            }
        }
    }
});

discord.login(config.discord.botToken);