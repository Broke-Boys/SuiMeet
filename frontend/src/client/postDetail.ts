import {PROFILE_ADDR, provider} from './config'


export const allPostDetails = async (
    postAddrs: string[]
) => {
    try {
        let objects = await provider.multiGetObjects({
          ids: postAddrs,
          options: { showContent: true },
          }
        );
        var res = []
        for (var j = 0; j < (objects as any).length; ++j) {
            var object = (objects as any)[j];
            let post_fields = (object as any).data.content.fields;
            //console.log(post_fields)
            var comms = [] as any
            try {
                comms = await provider.multiGetObjects({
                    ids: post_fields.comments,
                    options: {showContent: true}
                })
            } catch {

            }
            
            let likes_amount = post_fields.likes.fields.contents.length;
            var donated = (parseInt(post_fields.donated) / (10 ** 9)).toFixed(1);
            var liked = post_fields.likes.fields.contents.includes(PROFILE_ADDR());
            var msg = await provider.getObject(
                {
                    id: post_fields.message,
                    options: { showContent: true },
                }
            );
            let message = (msg as any).data.content.fields;
            const PROFILE_ADDRESS = message.author;
            const file_link = message.files;
            const text = message.text;
            const timestamp = message.timestamp;
            //console.log(message, "msg!!")
            res.push(
                {
                    ...message, 
                    likes: likes_amount,
                    id: {
                        id: postAddrs[j]
                    },
                    comments: comms,
                    messageAddr: message.id.id!,
                    liked: liked,
                    donated: donated
                }
            )
        } 
        return res
    } catch (e) {
        //console.log(e)
    }
}


export const postDetail = async (postAddr: string) => {
    try {
        let objects = await provider.getObject({
          id: postAddr,
          options: { showContent: true },
          }
        );
        //console.log(objects);
        
        let post_fields = (objects as any).data.content.fields;
        
        let comments = [];
        for (let i=0;i<post_fields.comments.length;i++){
          objects = await provider.getObject({
            id: post_fields.comments[i],
            options: { showContent: true },
            }
          );
          comments.push((objects as any).data.content.fields);
        }
    
        let likes_amount = post_fields.likes.fields.contents.length;
        var donated = (parseInt(post_fields.donated) / (10 ** 9)).toFixed(1);
        //console.log((parseInt(post_fields.donated) / (10 ** 9)).toFixed(1), "contents")
        var liked = post_fields.likes.fields.contents.includes(PROFILE_ADDR())
        objects =  await provider.getObject({
          id: post_fields.message,
          options: { showContent: true },
          }
        );
        let message = (objects as any).data.content.fields;
        const PROFILE_ADDRESS = message.author;
        const file_link = message.files;
        const text = message.text;
        const timestamp = message.timestamp;
        return {
            ...message, 
            likes: likes_amount,
            id: {
                id: postAddr
            },
            comments: comments,
            messageAddr: objects.data?.objectId!,
            liked: liked,
            donated: donated
        };
    } catch (error) {
        console.error(error);
    }
}


(async () => {
  
})();

