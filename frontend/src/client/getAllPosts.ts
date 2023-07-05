import { 
    JsonRpcProvider, 
    testnetConnection, 
    getTransactionSignature
} from '@mysten/sui.js';
import { CONTRACT_ADDRESS, provider } from './config';



export const getAllPosts = async (
    limit: number,
    cursor?: string
) => {
    try {

        const objects = await (provider as any).queryEvents({
          query: {
            'MoveEventType': `${CONTRACT_ADDRESS}::meet::EventCreatePost`
          },
          descending_order: true,
          limit: limit,
          cursor: cursor
        });
    
        // console.log(objects.data);
        let posts = [];
        for (let i=0;i<objects.data.length;i++){
            console.log(objects.data[i])  
            posts.push(objects.data[i].parsedJson.post_id);
        }
        try {
            return {
                postsIds: posts, 
                lastEvent: objects.data[objects.data.length-1].id,
                hasPage: posts.length ? true : false
            };
        } catch {
            return {
                postsIds: posts, 
                lastEvent: '',
                hasPage: false
            };
        }
    } catch (error) {
        console.error(error);
    }
}
