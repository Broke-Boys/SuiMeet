import { getAllPosts } from "./getAllPosts";
import { allPostDetails } from "./postDetail";

import { provider, CONTRACT_ADDRESS, PROFILE_ADDR } from "./config";


export const rankPost = async () => {
    try {
        let LIMIT = 100;
        const objects = await (provider as any).queryEvents({
          query: {
            'MoveEventType': `${CONTRACT_ADDRESS}::meet::EventCreatePost`
          },
          descending_order: true,
          limit: LIMIT
        });
    
        // console.log(objects.data);
        let posts_id = [];
        for (let i=0;i<objects.data.length;i++){
          posts_id.push(objects.data[i].parsedJson.post_id);
        }
    
        let posts = await allPostDetails(posts_id);
        
        let followings = await provider.getObject({
          id: PROFILE_ADDR()!,
          options: {showContent: true}
        });
        followings = (followings as any).data.content.fields.following.fields.contents;
        console.log(followings);
    
        let following_posts = [];
        for (let i=0;i<posts!.length;i++){
          if ((followings as any).includes(posts![i].author)){
            following_posts.push(posts![i]);
          }
        }
        console.log(following_posts)
        return following_posts;
    } catch (error) {
        console.error(error);
    }
}
