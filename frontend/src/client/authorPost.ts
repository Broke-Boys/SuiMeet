

import { 
    JsonRpcProvider, 
    testnetConnection, 

} from '@mysten/sui.js';
import { CONTRACT_ADDRESS, provider } from './config';


export const authorPosts = async (
    profileAddr: string,
    amount: number
) => {
    try {
        const objects = await (provider as any).queryEvents({
          query: {
            'MoveEventType': `${CONTRACT_ADDRESS}::meet::EventCreatePost`
          },
          descending_order: true,
          limit: amount
        });
    
        let author_posts = [];
        for (let i=0;i<objects.data.length;i++){
          if (objects.data[i].parsedJson.author == profileAddr){
            author_posts.push(objects.data[i].parsedJson.post_id);
          }
        }
        return author_posts;
    
    
    } catch (error) {
        console.error(error);
    }
}
