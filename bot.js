const Mineflayer = require('mineflayer');
const DiscordJS = require('discord.js');
const viewer = require('prismarine-viewer').headless;
const config = require('./config.json');
const discord = new DiscordJS.Client();
const mc = Mineflayer.createBot({
    host: config.minecraft.server.address,
    port: parseInt(config.minecraft.server.port),
    username: config.minecraft.username,
    password: config.minecraft.password,
    version: config.minecraft.server.version,
    auth: config.minecraft.authType
});

function log(message, discord) {
    if (discord) {
        channel.send("`" + message + "`");
        console.log("Minecraft: " + message);
    } else {
        channel.send(message);
        console.log(message);
    }
}

limboCmd = false;

discord.on('ready', () => {
    console.log(`Logged into Discord as ${discord.user.username}.`);
    channel = discord.channels.cache.get(config.discord.channelID);
    if (!channel) {
        console.log("Couldn't find the channel specified in config.json.\nMake sure your ID is valid or that you didn't copy something else in, then try again.")
        process.exit(1);
    }

})

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

})

mc.on('login', () => {
    log("Logged into Minecraft.");
    inGame = false;
})

mc.on('kicked', (reason, loggedIn) => log("**Kicked from game:** " + reason + loggedIn, false))

mc.on('error', err => {console.log(err); process.exit(1);})

mc.on('message', (message) => {
    message = message.toString();
    silence = false;

    config.minecraft.server.silenceMsgs.forEach(entry => {
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

    if (config.extras.hypixelAutoGG && (message.includes("Your game was boosted by") || message.includes("1st Place - "))) {
        setTimeout(() => {
            mc.chat("/ac gg")
        }, 5000);
        mc.chat("/tip all")
    }

    if (!silence && message.replace(/\s/g, '').length) {
        log(message, true)

        if (message.includes("The game starts") || message.includes("The game is starting in ")) {
            inGame = true;
        } else if (message.includes("     Looks like no one won. :(")) {
            log("Detected broken or empty game. Sending play command.");
            mc.chat("/play arcade_party_games_1");
        } else if ((message.includes(" joined the lobby!") && message.includes("[MVP+")) || message.includes("You are currently NICKED")) {
            inGame = false;
            if (config.extras.hypixelAutoMatch) {
                log("Detected to be in lobby, sending to game.");
                mc.chat("/play arcade_party_games_1");
            } else {
                log("Detected to be in lobby, sending to limbo.");
                mc.chat("/achat \u00a7c<3");
            }
        }
    }
})

discord.login(config.discord.botToken);