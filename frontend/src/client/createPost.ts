import { 
    SUI_CLOCK_OBJECT_ID, 
    testnetConnection, 
    Ed25519Keypair, 
    JsonRpcProvider, 
    RawSigner, 
    TransactionBlock 
} from '@mysten/sui.js';
import { CONTRACT_ADDRESS } from './config';


export const createPost = async (
    signAndExecuteTransactionBlock: any,
    text: string,
    files: string,
    profileAddr: string
) => {
    console.log(text, files, profileAddr);
    try{
        const tx = new TransactionBlock();
        tx.moveCall({
          target: `${CONTRACT_ADDRESS}::meet::create_post`,
          arguments: [
            tx.pure(profileAddr), tx.pure(text), tx.pure(files), tx.pure(SUI_CLOCK_OBJECT_ID)
          ],
        });
        const result = await signAndExecuteTransactionBlock({
          transactionBlock: tx,
        });
    
    } catch (error) {
        console.error(error);
    }
}
