import {provider} from './config'

export const getFollowers = async (
    profileAddr: string
) => {
    try {
        let objects = await provider.getObject({
          id: profileAddr,
          options: { showContent: true },
        });
        console.log(objects);
        const FOLLOWERS_REGISTRY_ADDRESS = (objects as any).data.content.fields.followers;
        console.log(FOLLOWERS_REGISTRY_ADDRESS);
        
        objects = await provider.getObject({
          id: FOLLOWERS_REGISTRY_ADDRESS,
          options: { showContent: true },
        });
    
        let followers_addrs = (objects as any).data.content.fields.followers.fields.contents;
        let followers = [] as any;
        try {
            followers = await provider.multiGetObjects({
                ids: followers_addrs,
                options: {showContent: true}
            })
        } catch {}
        
        // for (let i=0;i<followers_addrs.length;i++){
        //   followers.push( await provider.getObject({
        //     id: followers_addrs[i],
        //     options: { showContent: true },
        //   }));
        // }
        return followers;
    } catch (error) {
        console.error(error);
    }
}
(async () => {
  
})();

