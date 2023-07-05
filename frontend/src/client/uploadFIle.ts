import { Web3Storage } from "web3.storage";
import { FILECOIN_TOKEN } from "./config";


export const uploadFile = async (file: File) => {
    var storage = new Web3Storage({token: FILECOIN_TOKEN});
    
    var cid = await storage.put([file]);
    var link = `https://${cid}.ipfs.w3s.link/${file.name.replaceAll(' ', '%20')}`
    //console.log(link);
    return link
}
