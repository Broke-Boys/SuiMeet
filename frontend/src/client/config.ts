import {
    Connection,
    JsonRpcProvider,
    devnetConnection
} from '@mysten/sui.js'

export const CONTRACT_ADDRESS = '0x57353cc905161e6ebf75ab003e21c1c95367b6acf5828fcb19af18aadf0f782f';
export const PROFILE_ADDR = () => localStorage.getItem('profileAddr');
export const REGISTRY_ADDRESS = () => localStorage.getItem('registryAddr');
export const FILECOIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkzMTZCRGUwODhlQzZDMERDODZFNjIxNWJBYzZlNGE2N2ViOWVlNEMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMjM1MjU3MjUsIm5hbWUiOiJ0b2tlbiJ9.y1MPtXn6evn_ozC3jqU68f50RQSb3OMPDQHD-JodubI'

const connection = new Connection({
    fullnode: 'https://sui-testnet.blockvision.org/v1/2S6kV77zfTJFXVaTCyJJm7ONSIR'
});
   // connect to a custom RPC server
export const provider = new JsonRpcProvider(devnetConnection);