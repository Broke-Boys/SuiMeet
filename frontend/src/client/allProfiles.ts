import { 
    JsonRpcProvider, 
    testnetConnection, 
    getTransactionSignature
} from '@mysten/sui.js';
import { CONTRACT_ADDRESS } from './config';
import { provider } from './config';


export const allProfiles = async () => {
    try {
        const objects = await provider.queryEvents({
          query: {
            'MoveEventType': `${CONTRACT_ADDRESS}::meet::EventCreateProfile`
          }
        });
    
        let profiles = [];
        for (let i=0;i<objects.data.length;i++){
          profiles.push((objects as any).data[i].parsedJson.profile_id);
        }
        return profiles;
    
    } catch (error) {
        console.error(error);
    }
}
