import Web3 from 'web3'

const getPairAddress = async (tokenAddress) => {
    let web3 = new Web3(process.env.NODE_URL);
    const token = new web3.eth.Contract([
        {"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
    ], tokenAddress)
    
    const pairAddress = await token.methods.uniswapV2Pair().call()

    return pairAddress;
}

export default getPairAddress;