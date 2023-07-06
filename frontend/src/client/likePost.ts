import { 
    testnetConnection, 
    Ed25519Keypair, 
    JsonRpcProvider, 
    RawSigner, 
    TransactionBlock 
} from '@mysten/sui.js';
import { CONTRACT_ADDRESS } from './config';

// const keypair = new Ed25519Keypair();
// const signer = new RawSigner(keypair, provider);


export const likePost = async (
    signAndExecuteTransactionBlock: any,
    postAddr: string,
    profileAddr: string
) => {
    try {
        const tx = new TransactionBlock();
        tx.moveCall({
          target: `${CONTRACT_ADDRESS}::meet::like_post`,
          arguments: [
            tx.pure(postAddr), tx.pure(profileAddr)
          ],
        });
        const result = await signAndExecuteTransactionBlock({
          transactionBlock: tx,
        });
        return {errors: false}
      } catch (error) {
        console.error(error);
        return {errors: true}
      }
}
