var jimp = require("jimp");
var fs = require("fs");
const { exec } = require("child_process");

function videoIntoFrames(video, fps){
    //Something wrong with the command, hmmm.
    exec(`ffmpeg -i "${process.cwd() + "/" + video}.mp4" -preset slow -crf 18 -r ${fps} "${process.cwd() + "/" + video+ "frames"}/%d.png"`);
}

function frameIntoText(image, chars){
    let frameText = "";
    for(let y = image.bitmap.height-1; y >= 0; y--){
        for(let x = 0; x <= image.bitmap.width-1; x++){
			let {r,g,b} = jimp.intToRGBA(img.getPixelColor(x,y));
            frameText+=chars[Math.floor(((r+g+b)/3/255)*(chars.length-1))];
        }
        frameText+="\n";
    }
    console.log(frameText);
    return frameText;
}

function allFramesIntoText(videoName,  resX, resY){
    let chars = "⬛⚫🖤🔳🔲🤍⚪⬜";
    //Absoloute file path is correct but readDir finds no files inside. Only jpgs.
    let files = fs.readdirSync(`${ process.cwd() + "/"+ videoName + "frames/"}`);
    console.log(files);
    for(let i = 0; i < files.length-1; i++){
        let img = jimp.read(process.cwd() + "/" + videoName + "/" + file[i]);
        img.resize(resX, resY);
        let frame = frameIntoText(img, chars);
        fs.writeFileSync(`${videoName}txt\\${file}.txt`, frame, "utf8");
    }
}

module.exports = {videoIntoFrames, allFramesIntoText};
