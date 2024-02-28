import axios from 'axios'
const get_headers = (token=None, content_type="application/json") => {
    let headers= {"Content-Type": content_type, "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11", "X-Api-Key": token}
    return headers;
}

const getPairAddress = async (tokenAddress) => {
    try {
        // let web3 = new Web3(process.env.NODE_URL);
        // const token = new web3.eth.Contract([
        //     {"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
        // ], tokenAddress)
        
        // const pairAddress = await token.methods.uniswapV2Pair().call()

        let options = {
            method: "GET",
            url: `https://api.dextools.io/v1/token?chain=ether&address=${tokenAddress}`,
            headers: get_headers(process.env.DEXTOOLS_API_KEY),
          };
      
        let res = (await axios.request(options)).data
        const pairAddress = res.data?.reprPair?.id?.pair;
        console.log(pairAddress)
    
        return pairAddress;
    } catch (e) {
        console.log("Get Pair Address: ", e)
        return null;
    }
}

export default getPairAddress;