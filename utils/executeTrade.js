import data from '../config.js'
import ethers from 'ethers'

export const executeTrade = async (type, address, amount, slippage, _gasPrice, gasLimit) => {
    try {
        let provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
        let wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
        let account = wallet.connect(provider)
        let router = new ethers.Contract(
            data.routerAddress,
            data.routerABI,
            account
        )
    
        let gasPrice = await provider.getGasPrice();
        gasPrice = gasPrice.mul(parseInt(_gasPrice)).div(100);
    
        if(type == "buy") {
    
            const balance = await account.getBalance();
            let ethAmount;
            if(amount.includes('%')) {
                ethAmount = balance.mul(parseInt(parseFloat(amount.replace('%','')) * 100)).div(10000);
                ethAmount = parseFloat(ethers.utils.formatEther(ethAmount));
            } else {
                ethAmount = parseFloat(amount);
            }
            if(parseFloat(ethers.utils.formatEther(balance)) <= ethAmount + 0.001) {
                console.log("Low ETH Balance");
                return;
            }
    
            var amountIn = ethers.utils.parseUnits(
                ethAmount.toString(),
                "ether"
            );
    
            var amounts = await router.getAmountsOut(amountIn, [
                data.WETH_ADDRESS,
                address,
            ]);
            var amountOutMin = amounts[1].sub(
                amounts[1].mul(`${slippage*10}`).div(1000)
            );
    
            console.log(chalk.green.inverse(`Buying Token\n`));
    
            let buy_tx = await router.swapExactETHForTokens(
                amountOutMin,
                [data.WETH_ADDRESS, address],
                process.env.PUBLIC_KEY,
                Date.now() + 5 * 60 * 1000,
                {
                    gasPrice: gasPrice,
                    gasLimit: gasLimit,
                    value: amountIn,
                }
            ).catch((err) => {
                console.log('Transaction failed: ', err.reason);
            })
    
            if(!buy_tx) return;
            console.log("Pending...", buy_tx);
            
            let tx = await buy_tx.wait();
    
            console.log("Success!!!", tx);
    
        } else if (type == "sell") {
            if(amount.includes('%')) {
                let percent = parseFloat(amount.replace('%',''));
                const tokenContract = new ethers.Contract(
                    address,
                    data.decimalABI,
                    account
                )
                const balance = await tokenContract.balanceOf(process.env.PUBLIC_KEY);
                const decimal = await tokenContract.decimals();
                let tokenAmount;
    
                tokenAmount = parseInt(ethers.utils.formatUnits(balance, decimal)) * percent / 100;
    
                if(balance == 0) {
                    console.log("Low Token Balance");
                    return;
                }
        
                let allow = await tokenContract.allowance(process.env.PUBLIC_KEY, data.routerAddress)
                allow = parseFloat(ethers.utils.formatUnits(allow, decimal));
    
                if(tokenAmount > allow) {
                    console.log("Approve...");
                    const approve_tx = await tokenContract.approve(
                        data.routerAddress,
                        ethers.utils.parseUnits(
                            tokenAmount.toString(),
                            decimal
                        ),
                        {
                            gasPrice: gasPrice,
                            gasLimit: gasLimit,
                        },
                    )
                    const result = await approve_tx.wait();
                    console.log(result);
                }
        
                console.log(chalk.green.inverse(`Selling Token\n`));
        
                let buy_tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
                    ethers.utils.parseUnits(
                        tokenAmount.toString(),
                        "ether"
                    ),
                    0,
                    [address, data.WETH_ADDRESS],
                    process.env.PUBLIC_KEY,
                    Date.now() + 5 * 60 * 1000,
                    {
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                    }
                ).catch((err) => {
                    console.log(err);
                    console.log('Transaction failed: ', err.reason);
                })
        
                if(!buy_tx) return;
                console.log("Pending...", buy_tx);
                
                let tx = await buy_tx.wait();
        
                console.log("Success!!!", tx);
            } else {
                let ethAmount = parseFloat(amount);
                const tokenContract = new ethers.Contract(
                    address,
                    data.decimalABI,
                    account
                )
                const balance = await tokenContract.balanceOf(process.env.PUBLIC_KEY);
    
                const amounts = await router.getAmountsIn(
                    ethers.utils.parseUnits(
                        ethAmount.toString(),
                        decimal
                    ), [
                        address,
                        data.WETH_ADDRESS,
                    ]);
        
                var amountInMax = amounts[0].add(
                    amounts[0].mul(`${slippage*10}`).div(1000)
                );
                // var amounts = await router.getAmountsOut(balance, [
                //     address,
                //     data.WETH_ADDRESS,
                // ]);
                // var amountOutMin = amounts[1].sub(
                //     amounts[1].mul(`${slippage*10}`).div(1000)
                // );
                const tokenAmount = parseInt(ethers.utils.formatUnits(amounts[0], decimal))
    
                if(parseFloat(ethers.utils.formatUnits(balance, decimal)) < tokenAmount) {
                    console.log("Low Token Balance");
                    return;
                }
        
                let allow = await tokenContract.allowance(process.env.PUBLIC_KEY, data.routerAddress)
                allow = parseFloat(ethers.utils.formatUnits(allow, decimal));
    
                if(balance > allow) {
                    console.log("Approve...");
                    const approve_tx = await tokenContract.approve(
                        data.routerAddress,
                        balance,
                        {
                            gasPrice: gasPrice,
                            gasLimit: gasLimit,
                        },
                    )
                    const result = await approve_tx.wait();
                    console.log(result);
                }    
                console.log(chalk.green.inverse(`Selling Token\n`));
                    
                let buy_tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
                    ethers.utils.parseUnits(
                        tokenAmount.toString(),
                        decimal
                    ),
                    0,
                    [address, data.WETH_ADDRESS],
                    process.env.PUBLIC_KEY,
                    Date.now() + 5 * 60 * 1000,
                    {
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                    }
                ).catch((err) => {
                    console.log(err);
                    console.log('Transaction failed: ', err.reason);
                })
        
                if(!buy_tx) return;
                console.log("Pending... ", buy_tx);
                
                let tx = await buy_tx.wait();
                console.log("Success!!!", tx);
            }
        }
    } catch (e) {
        console.log("Error in Execute Trade: ", e);
    }
}


export default executeTrade;