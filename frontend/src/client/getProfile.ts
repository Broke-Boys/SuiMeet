import { 
    JsonRpcProvider, 
    testnetConnection, 
    getTransactionSignature
} from '@mysten/sui.js';
import { provider } from './config';




export const getProfile = async (profileAddress: string) => {
    try {
        //console.log(profileAddress)
        const objects = await provider.getObject({
          id: profileAddress,
          options: { showContent: true },
          }
        );
        let profile_fields = (objects as any).data.content.fields;
        return profile_fields;
    } catch (error) {
        console.error(error);
    }
}
