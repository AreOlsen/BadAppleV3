var discord = require("discord.js-12");
var fs = require("fs");
var videoprocessor = require("./videoprocessor.js");

let maintoken = fs.readFileSync("mothershiptoken.txt", "utf8");
let bots = fs.readFileSync("bottokens.txt", "utf8").trim().split("\n").map(token =>{
    let bot = new discord.Client();
    bot.login(token);
    return bot;
});

//get mothership online
let maincleint = new discord.Client();
maincleint.login(maintoken);

const prefix = "!";

maincleint.on("message", message => {
    console.log("Got message: " + message.content);
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.trim().split(/ +/g);
    console.log(args);
    const cmd = args[0].slice(prefix.length).toLowerCase(); // case INsensitive, without prefix
    console.log(cmd);
    if (cmd == "play"){
        console.log("Playing vid");
        play(args[1], message.channelId);
    };
});

let play = function(video, channelID) {
    let bot = 0;
    //If the video we want to play actually exists.
    if(fs.existsSync(video+".mp4")){
        let frames = [];
        if(fs.existsSync(video+"txt")){
            for(let i = 0; i < fs.readdirSync(video+"txt").length-1; i++){
                frames.Append(fs.readFileSync(video+`txt\\${i}.txt`, "utf8"));
            }
        }else{
            console.log("Generating " + video + "frame files");
            fs.mkdirSync(video+"frames");
            videoprocessor.videoIntoFrames(video, bots.length);
            setTimeout(play, 3000);
            fs.mkdirSync(video+"txt");
            console.log("Generating " + video + "text files");
            videoprocessor.allFramesIntoText(video, 52, 38);
            for(let i = 0; i < fs.readdirSync(video+"txt").length-1; i++){
                frames.Append(fs.readFileSync(video+`txt\\${i}.txt`, "utf8"));
            }
        }
        for(let i = 0; i < frames.length-1; i++){
            bots[++bot%bots.length].channels.resolve(`${channelID}`).send('```'+frames[i]+'```');
            setTimeout(play, 1000/bots.length);
        }
    }
}
//Update to include audio from main bot.

