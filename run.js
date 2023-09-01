import dotenv  from "dotenv"
import getPairAddress from './utils/getPairAddress.js'
import getSlippage from './utils/getSlippage.js'
import executeTrade from "./utils/executeTrade.js"
import axios from 'axios';

dotenv.config()
const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // delay time
let lastTime;

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
const get_headers = (token=None, content_type="application/json") => {
    let headers= {"Content-Type": content_type, "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11", "Authorization": token}
    return headers;
}

export const discord_api = async () => {
    let content = {}
    let options = {
        method: "GET",
        url: `https://discord.com/api/v9/channels/${process.env.CHANNEL_ID}/messages?limit=1`,
        headers: get_headers(process.env.USER_TOKEN),
      };
  
    let res = (await axios.request(options)).data[0];

    let time = new Date(res.timestamp)
    time = time.getTime()
    console.log(lastTime, time)

    if(lastTime < time) {
        content = res.content
        lastTime = time;
    }
    
    return content;
}

const scrape_discord = async () => {
    let time = new Date(Date.now())
    console.log(time.toString())

    const content = await discord_api();
    if(Object.keys(content).length) {
        const n = content.search('\n0x')
        const tokenAddress = content.substring(n+1, n+43)

        console.log("Token: ", tokenAddress)
        const pairAddress = await getPairAddress(tokenAddress)

        if(pairAddress) {
            const url = `https://www.dextools.io/app/en/ether/pair-explorer/${pairAddress}`
    
            const slippage = await getSlippage(url)

            await executeTrade("buy", tokenAddress, process.env.AMOUNT, slippage.buy, process.env.GAS_PRICE, process.env.GAS_LIMIT)
            return;
        }
    }
    
    await delay(5000)
    scrape_discord()
}

lastTime = Date.now()
scrape_discord()