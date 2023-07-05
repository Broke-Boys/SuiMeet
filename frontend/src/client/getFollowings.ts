import {provider} from './config';


export const getFollowings = async (
    profileAddr: string
) => {
    try {
        let objects = await provider.getObject({
          id: profileAddr,
          options: { showContent: true },
        });
        let following_addrs = (objects as any).data.content.fields.following.fields.contents;
    
        let following = await provider.multiGetObjects({
            ids: following_addrs,
            options: {showContent: true}
        });
        
        return following
    } catch (error) {
        console.error(error);
    }
}

(async () => {
  
})();

