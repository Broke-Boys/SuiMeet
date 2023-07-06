import { 
    testnetConnection, 
    Ed25519Keypair, 
    JsonRpcProvider, 
    RawSigner, 
    TransactionBlock 
} from '@mysten/sui.js';
import { CONTRACT_ADDRESS } from './config';

export const editPost = async (
    signAndExecuteTransactionBlock: any,
    content: string,
    files: string,
    messageAddr: string
) => {
    try {
    
        const tx = new TransactionBlock();
        tx.moveCall({
          target: `${CONTRACT_ADDRESS}::meet::edit_post`,
          arguments: [
            tx.pure(messageAddr), 
            tx.pure(content), 
            tx.pure(files)
          ],
        });
        const result = await signAndExecuteTransactionBlock({
          transactionBlock: tx,
        });
        return {
            error: false
        }
    } catch (error) {
        console.error(error);
        return {
            error: true
        }
    }
}
