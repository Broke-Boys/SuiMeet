import { 
    SUI_CLOCK_OBJECT_ID, 
    testnetConnection, 
    Ed25519Keypair, 
    JsonRpcProvider, 
    RawSigner, 
    TransactionBlock ,
    
} from '@mysten/sui.js';
import { PROFILE_ADDR, REGISTRY_ADDRESS, CONTRACT_ADDRESS, provider } from './config';



export const makeDonate = async (
    walletAddr: string,
    signAndExecuteTransactionBlock: any,
    postAddr: string,
    amount: number
) => {
    try {

        // Каждый коин SUI это 10**9 его единиц
        // Так что если на балансе допустим 0.7 SUI то это 700_000_000
        // const txb = new TransactionBlock();
        
        var txb = new TransactionBlock();
        const coin = txb.splitCoins(
            txb.gas,
            [ 
                txb.pure(amount),
            ]
        );
        //console.log(coin[0])


        // let objects = await provider.getCoins({
        //     owner: walletAddr,
        //     }
        // )
        // await new Promise(r => setTimeout(r, 2000));
        // var COIN_ADDR = ''
        // for (let i=0;i<objects.data.length;i++){
        //     //console.log((objects as any).data)
        //     if ((objects as any).data[i].balance == amount){
        //         COIN_ADDR = objects.data[i].coinObjectId;
        //         //console.log(COIN_ADDR)
        //     }
        // }
        // const COIN_ADDRESS = objects.data[0].coinObjectId;
        
        ////console.log(postAddr, REGISTRY_ADDRESS()!, COIN_ADDRESS, amount)
        //console.log(coin)
        txb.moveCall({
          target: `${CONTRACT_ADDRESS}::meet::make_donate`,
          arguments: [
            txb.object(postAddr), 
            txb.object(REGISTRY_ADDRESS()!), 
            coin
            //tx.pure(amount)
          ],
        });
        const sig = await signAndExecuteTransactionBlock({
            transactionBlock: txb,
          });
        // await provider.executeTransactionBlock({
        //     'signature': sig1,
        //     'transactionBlock': txb as any
        // })
        // await provider.executeTransactionBlock({
        //     'signature': sig2,
        //     'transactionBlock': tx as any
        // })
    
    } catch (error) {
        console.error(error);
    }
}


(async () => {
  
})();

