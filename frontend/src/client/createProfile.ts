import { 
    testnetConnection, 
    Ed25519Keypair, 
    JsonRpcProvider, 
    RawSigner, 
    TransactionBlock,
    SUI_CLOCK_OBJECT_ID
} from '@mysten/sui.js';
import { CONTRACT_ADDRESS, REGISTRY_ADDRESS, provider } from './config';


export const getProfileAddr = async (
    walletAddr: string
) => {
    const objects = await provider.getOwnedObjects({
        owner: walletAddr,
        options: { showContent: true },
        filter: {
          "MatchAll":[
            {
              "StructType": `${CONTRACT_ADDRESS}::meet::Profile`
            },
          ]
        }
    });
    var profileAddress = (objects as any).data[0].data.objectId
    localStorage.setItem('profileAddr', profileAddress);
}


export const createProfile = async (
    signAndExecuteTransactionBlock: any,
    name: string,
    photo_url: string,
    address: string
) => {
    const PROFILE_REGISTRY_ADDRESS = REGISTRY_ADDRESS();

    try {
        // ЗДЕСЬ ДОЛЖНА БЫТЬ ССЫЛКА НА IPFS 
        let url = photo_url
    
        const tx = new TransactionBlock();
        tx.moveCall({
          target: `${CONTRACT_ADDRESS}::meet::create_profile`,
          arguments: [
            tx.object(PROFILE_REGISTRY_ADDRESS!), 
            tx.pure(name), 
            tx.pure(url),
            tx.object(SUI_CLOCK_OBJECT_ID)
          ],
        });
        const result = await signAndExecuteTransactionBlock({
          transactionBlock: tx,
        });
        await new Promise(r => setTimeout(r, 2000));
        const objects = await provider.getOwnedObjects({
            owner: address,
            options: { showContent: true },
            filter: {
              "MatchAll":[
                {
                  "StructType": `${CONTRACT_ADDRESS}::meet::Profile`
                },
              ]
            }
        });
        var profileAddress = (objects as any).data[0].data.objectId
        localStorage.setItem('profileAddr', profileAddress);
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
