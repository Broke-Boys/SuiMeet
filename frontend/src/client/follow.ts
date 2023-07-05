import { 
    JsonRpcProvider, 
    testnetConnection, 
    TransactionBlock
} from '@mysten/sui.js';
import { CONTRACT_ADDRESS, PROFILE_ADDR, provider } from './config';



export const follow = async (
    signAndExecuteTransactionBlock: any,
    followOn: string
) => {
    const PROFILE_ADDRESS = PROFILE_ADDR();
    try {
        // Из адреса профиля на кого подписаться, получаем обьекта подписчиков
        var objects = await provider.getObject({
          id: followOn,
          options: { showContent: true },
        });
    
        const FOLLOWERS_REGISTRY_ADDRESS = (objects as any).data.content.fields.followers;
        const tx = new TransactionBlock();
        tx.moveCall({
          target: `${CONTRACT_ADDRESS}::meet::follow_profile`,
          arguments: [
            tx.pure(PROFILE_ADDRESS), tx.pure(FOLLOWERS_REGISTRY_ADDRESS), 
            tx.pure(followOn)
          ],
        });
        const result = await signAndExecuteTransactionBlock({
          transactionBlock: tx,
        });
    } catch (error) {
    console.error(error);
    }
}
