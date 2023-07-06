import { 
    SUI_CLOCK_OBJECT_ID, 
    testnetConnection, 
    Ed25519Keypair, 
    JsonRpcProvider, 
    RawSigner, 
    TransactionBlock 
} from '@mysten/sui.js';

import { CONTRACT_ADDRESS, PROFILE_ADDR } from './config';


// const keypair = new Ed25519Keypair();
// const signer = new RawSigner(keypair, provider);


export const commentPost = async (
    signAndExecuteTransactionBlock: any,
    postAddr: string,
    content: string
) => {
    try {
        var profileAddr = PROFILE_ADDR();
        const tx = new TransactionBlock();
        tx.moveCall({
          target: `${CONTRACT_ADDRESS}::meet::make_comment`,
          arguments: [
            tx.pure(postAddr), 
            tx.pure(profileAddr), 
            tx.pure(content), 
            tx.pure(SUI_CLOCK_OBJECT_ID)
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

