import { allProfiles } from "../client/allProfiles";
import { PROFILE_ADDR } from "../client/config";
import { getProfile } from "../client/getProfile";
import { formatAddress } from '@mysten/sui.js';

export interface IDataShortProfile {
    name: string;
    wallet: string;
    fullWallet: string;
    imageUrl: string;
}

export const blockchainToStructAdaptee = (profileData: any) => {
    return {
        name: profileData.name,
        wallet:  formatAddress(profileData.id.id),
        imageUrl: profileData.image_url,
        fullWallet: profileData.id.id
    } as IDataShortProfile
}


export const getSuggestedProfiles = async () => {
    var profileIds = (await allProfiles())?.filter(e => e != PROFILE_ADDR());
    var profiles = []
    for (var i = 0; i < profileIds?.length!; ++i) {
        profiles.push(await getProfile(profileIds![i]));
    }
    return profiles?.map(blockchainToStructAdaptee)
}