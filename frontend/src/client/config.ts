import {
    Connection,
    JsonRpcProvider,
    testnetConnection
} from '@mysten/sui.js'

export const CONTRACT_ADDRESS = '0x7fb0e470fc784fbaa6e806d0b4d9781ab0a5a19dc363c8ae484073e520852aba';
export const PROFILE_ADDR = () => localStorage.getItem('profileAddr');
export const REGISTRY_ADDRESS = () => localStorage.getItem('registryAddr');
export const FILECOIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkzMTZCRGUwODhlQzZDMERDODZFNjIxNWJBYzZlNGE2N2ViOWVlNEMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMjM1MjU3MjUsIm5hbWUiOiJ0b2tlbiJ9.y1MPtXn6evn_ozC3jqU68f50RQSb3OMPDQHD-JodubI'

const connection = new Connection({
    fullnode: 'https://sui-testnet.blockvision.org/v1/2S6kV77zfTJFXVaTCyJJm7ONSIR'
});
   // connect to a custom RPC server
export const provider = new JsonRpcProvider(testnetConnection);