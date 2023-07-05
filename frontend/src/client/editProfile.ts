import { 
    testnetConnection, 
    Ed25519Keypair, 
    JsonRpcProvider, 
    RawSigner, 
    TransactionBlock 
} from '@mysten/sui.js';
import { PROFILE_ADDR } from './config';
import { CONTRACT_ADDRESS } from './config';



export const editProfile = async (
    name: string,
    description: string,
    imageUrl: string,
    isGroup: boolean,
    signAndExecuteTransactionBlock: any
) => {
    try {
        // ЗДЕСЬ ДОЛЖНА БЫТЬ ССЫЛКА НА IPFS 
        // Если группа то 1 иначе 0
        var profileAddr = PROFILE_ADDR();
        const tx = new TransactionBlock();
        var groupNumber = isGroup ? 1 : 0;
        tx.moveCall({
          target: `${CONTRACT_ADDRESS}::meet::edit_profile`,
          arguments: [
            tx.pure(profileAddr), 
            tx.pure(name), 
            tx.pure(imageUrl), 
            tx.pure(description), 
            tx.pure(groupNumber)
          ],
        });
        const result = await signAndExecuteTransactionBlock({
          transactionBlock: tx,
        });
    
    } catch (error) {
        console.error(error);
    }
}
