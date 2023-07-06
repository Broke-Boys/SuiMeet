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
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${CONTRACT_ADDRESS}::meet::create_post`,
        arguments: [
        tx.pure(profileAddr), tx.pure(text), tx.pure(files), tx.pure(SUI_CLOCK_OBJECT_ID)
        ],
    });
    try {
        await signAndExecuteTransactionBlock({
            transactionBlock: tx
        });
        return {
            error: false
        }
    } catch {
        return {
            error: true
        }
    }
}
