import { 
    TransactionBlock 
} from '@mysten/sui.js';
import { PROFILE_ADDR } from './config';
import { CONTRACT_ADDRESS } from './config';

// const keypair = new Ed25519Keypair();
// const signer = new RawSigner(keypair, provider);


export const unlikePost = async (
    signAndExecuteTransactionBlock: any,
    postAddr: string
) => {
    var profileAddr = PROFILE_ADDR()!;
    try {

        const tx = new TransactionBlock();
        tx.moveCall({
          target: `${CONTRACT_ADDRESS}::meet::unlike_post`,
          arguments: [
            tx.pure(postAddr), tx.pure(profileAddr)
          ],
        });
        const result = await signAndExecuteTransactionBlock({
          transactionBlock: tx,
        });
        console.log({ result });
    
    } catch (error) {
        console.error(error);
    }
}
