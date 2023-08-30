import dotenv  from "dotenv"
import { discord_api } from './utils/api.js'
import getPairAddress from './utils/getPairAddress.js'
import {PythonShell} from 'python-shell'

dotenv.config()
const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // delay time

// const scrape_dextools = async (url) => {
//     console.log(url)
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();

//     await page.goto(url, {
//         waitUntil: 'networkidle2'
//     })
    
//     await page.waitForNavigation({
//         waitUntil: 'networkidle0',
//     });

//     let source = await page.content();
//     fs.writeFile('output.txt', source, (err) => {
//         if(err) throw err;
//     })

//     const f = await page.$('[class="ng-star-inserted"]')
//     console.log(f)
// }

const scrape_discord = async () => {
    let time = new Date(Date.now())
    console.log(time.toString())

    const content = await discord_api();
    if(Object.keys(content).length) {
        console.log("Started")

        lastTime = Date.now()
        const n = content.search('\n0x')
        const tokenAddress = content.substring(n+1, n+43)
        const pairAddress = await getPairAddress(tokenAddress)

        const url = `https://www.dextools.io/app/en/ether/pair-explorer/${pairAddress}`

        let options = {
            mode: 'text',
            pythonOptions: ['-u'], // get print results in real-time
            args: [url] //An argument which can be accessed in the script using sys.argv[1]
        };
        PythonShell.run('scrape_dextools.py', options).then(messages => {
            console.log(messages);
        })
    }
    
    await delay(5000)
    // scrape_discord()
}

let lastTime = Date.now()

scrape_discord()