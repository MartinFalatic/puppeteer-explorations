
const puppeteer = require('puppeteer');
 
var express = require('express');
var app = express();

var process = require('process')

process.on('SIGINT', () => {
    console.info("Interrupted")
    process.exit(0)
})

// Helps Docker actually gracefully exit on SIGTERM
process.on('SIGTERM', () => {
    console.info("Exiting")
    process.exit(0)
})

async function main() {
    // This isn't terribly purposeful yet, just a quick test
    app.get('/', function (req, res) {
    res.send('Greetings Professor Falken!');
    });

    var port = process.env.PORT || 3000;
    app.listen(port, function () {
    console.log('app listening on port ' + port);
    });

    // Start puppeteer and screenshot a webpage
    // Based on https://developers.google.com/web/tools/puppeteer/get-started

    // /myapp/node_modules/puppeteer/.local-chromium/linux-938248/chrome-linux/chrome

    if (true) {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: "./node_modules/puppeteer/.local-chromium/linux-938248/chrome-linux/chrome",
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-sandbox',
            ],
            ignoreDefaultArgs: [
                '--disable-extensions'
            ]
        });
        console.log('browser launched');

        const page = await browser.newPage();
        await page.goto("https://www.example.com");
        const ss = await page.screenshot({path: "/opt/app/output/screenshot.png"});

        await page.close();
        await browser.close();
        console.log('browser closed');
    }
}

main();
