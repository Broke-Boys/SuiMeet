import {
    Connection,
    JsonRpcProvider,
    testnetConnection
} from '@mysten/sui.js'

export const CONTRACT_ADDRESS = '0x20d2f7cc55a5abd3e9702f69e502e8bff095a6c65a9b1ff186f9cadf7c3e5577';
export const PROFILE_ADDR = () => localStorage.getItem('profileAddr');
export const REGISTRY_ADDRESS = () => localStorage.getItem('registryAddr');
export const FILECOIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkzMTZCRGUwODhlQzZDMERDODZFNjIxNWJBYzZlNGE2N2ViOWVlNEMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMjM1MjU3MjUsIm5hbWUiOiJ0b2tlbiJ9.y1MPtXn6evn_ozC3jqU68f50RQSb3OMPDQHD-JodubI'

const connection = new Connection({
    fullnode: 'https://sui-testnet.blockvision.org/v1/2S6kV77zfTJFXVaTCyJJm7ONSIR'
});
   // connect to a custom RPC server
export const provider = new JsonRpcProvider(testnetConnection);
