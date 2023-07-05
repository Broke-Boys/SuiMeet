import { CONTRACT_ADDRESS, provider } from './config';


export const getRegistryAddress = async () => {
    try {
        // get tokens from the DevNet faucet server
        const objects = await provider.queryEvents({
          query: {
            'MoveEventType': `${CONTRACT_ADDRESS}::meet::EventCreateRegistry`
          }
        });
    
        const PROFILE_REGISTRY_ADDRESS = (objects as any).data[0].parsedJson.registry_id;
        return PROFILE_REGISTRY_ADDRESS;
        
      } catch (error) {
        console.error(error);
      }
}
