
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

    // Start puppeteer and perform some operations
    // Based on https://developers.google.com/web/tools/puppeteer/get-started

    // /myapp/node_modules/puppeteer/.local-chromium/linux-938248/chrome-linux/chrome

    if (true) {
        const browser = await puppeteer.launch({
            dumpio: true,  // You may see dbus errors
            headless: true,
            executablePath: "./node_modules/puppeteer/.local-chromium/linux-938248/chrome-linux/chrome",  // puppeteer@~13.0.0
            //executablePath: "./node_modules/puppeteer/.local-chromium/linux-884014/chrome-linux/chrome",  // puppeteer@~10.0.0, ~10.1.0
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

        var page;
        var call;

        // Take a screenshot of a page
        page = await browser.newPage();
        await page.goto('https://www.example.com', {
            waitUntil: 'networkidle2',
        });
        call = await page.screenshot({path: '/myapp/output/screenshot.png', format: 'a4', fullPage: true });
        await page.close();

        // Save a page as PDF
        page = await browser.newPage();
        await page.goto('https://news.ycombinator.com', {
            waitUntil: 'networkidle2',
        });
        call = await page.pdf({ path: '/myapp/output/screenshot.pdf', format: 'legal' });
        await page.close();

        // Save a page as PDF
        page = await browser.newPage();
        await page.goto('file:///myapp/content/index.html', {
            waitUntil: 'networkidle2',
        });

        // page.on("pageerror", function(err) {  
        //     theTempValue = err.toString();
        //     console.log("Page error: " + theTempValue); 
        // });

        call = await page.screenshot({ path: '/myapp/output/screenshot2.png', format: 'a4', fullPage: true });
        call = await page.pdf({ path: '/myapp/output/screenshot2.pdf', format: 'Legal' });
        await page.close();

        await browser.close();
        console.log('browser closed');
    }

    // The following is a bad idea when the container is set to restart!
    // process.exit(0);
}

main();
