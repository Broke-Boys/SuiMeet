import { 
    JsonRpcProvider, 
    testnetConnection, 
    TransactionBlock
} from '@mysten/sui.js';
import { PROFILE_ADDR, CONTRACT_ADDRESS, provider } from './config';


export const unfollow = async (
    signAndExecuteTransactionBlock: any,
    unfollowAddr: string,
) => {
    var profileAddress = PROFILE_ADDR();
    try {
        // Из адреса профиля на кого подписаться, получаем обьекта подписчиков
        var objects = await provider.getObject({
          id: unfollowAddr,
          options: { showContent: true },
        });
    
        const FOLLOWERS_REGISTRY_ADDRESS = (objects as any).data.content.fields.followers;
    
        const tx = new TransactionBlock();
        tx.moveCall({
          target: `${CONTRACT_ADDRESS}::meet::unfollow_profile`,
          arguments: [
            tx.pure(profileAddress), tx.pure(FOLLOWERS_REGISTRY_ADDRESS), 
            tx.pure(unfollowAddr)
          ],
        });
        const result = await signAndExecuteTransactionBlock({
          transactionBlock: tx,
        });
    
      } catch (error) {
        console.error(error);
      }
} 
