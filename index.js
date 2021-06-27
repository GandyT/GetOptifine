const fetch = require("node-fetch");
const fs = require("fs");
const https = require("https");

fetch("https://optifine.net/adloadx?f=OptiFine_1.8.9_HD_U_M5.jar")
    .then(async res => {
        var text = await res.text();
        var linkIndex = text.indexOf("downloadx?f=OptiFine_1.8.9_HD_U_M5.jar&x=");
        var cutText = text.slice(linkIndex);
        var endIndex = cutText.indexOf("'");
        var link = "https://optifine.net/" + cutText.slice(0, endIndex);
        var outputStream = fs.createWriteStream("output/OptiFine_1.8.9_HD_U_M5.jar");
        https.get(link, (optiJar) => {
            console.log(`Downloading from ${link}`);
            var len = parseInt(optiJar.headers['content-length'], 10);
            var cur = 0;
            var total = len / 1048576; //1048576 - bytes in 1 Megabyte

            optiJar.on("data", chunk => {
                cur += chunk.length;
                displayProgress(cur, len, total);
            })
            optiJar.on("end", () => {
                console.log("Download Finished");
            })
            optiJar.pipe(outputStream);
        })
    });

const displayProgress = (cur, len, total) => {
    console.log(`Downloading ${(100.0 * cur / len).toFixed(2)}% / 100% - (${total.toFixed(2)} MB)`);
}