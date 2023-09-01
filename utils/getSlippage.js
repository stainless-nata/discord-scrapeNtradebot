import { PythonShell } from 'python-shell'

export const getSlippage = async (url) => {
    try {
        let options = {
            mode: 'text',
            pythonOptions: ['-u'], // get print results in real-time
            args: [url] //An argument which can be accessed in the script using sys.argv[1]
        };
        const messages = await PythonShell.run('scrape_dextools.py', options)
    
        let buy = messages[0]
        let sell = messages[0]
        let buyp = buy.search("%");
        let sellp = sell.search("%");
        buy = buyp == -1 ? 0 : parseInt(buy.substring(0, buyp))
        sell = sellp == -1 ? 0 : parseInt(sell.substring(0, sellp))
        return {
            buy: buy,
            sell: sell
        }
    } catch (e) {
        console.log("Error in Get Slippage: ", e)
        return 100;
    }
}

export default getSlippage;