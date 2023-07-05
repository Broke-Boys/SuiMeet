import react from 'react'
import './style.css';
import { useWalletKit } from '@mysten/wallet-kit';
import { getProfile } from '../../../client/getProfile';
import { dataFullProfileAdaptee } from '../../desktop/main';
import { blockchainToStructAdaptee } from '../../../service/getSuggestedProfiles';
import { PROFILE_ADDR } from '../../../client/config';
import {Avatar} from 'antd';

interface ITextarea {
    onChange?: (e: string) => void;
    value?: string;
    setText: (e: string) => void;
}

export const Textarea: react.FC<ITextarea> = (props) => {
   const [img, setImg] = react.useState('');
   const queried = react.useRef(false);
   const {currentAccount} = useWalletKit();
   const onChange = props.onChange ? props.onChange : (e: string) => {}

   if (!queried.current && currentAccount?.address) {
    queried.current = true;
    getProfile(PROFILE_ADDR()!).then((e) => {
        setImg(blockchainToStructAdaptee(e).imageUrl)
    })
   }
   
   return <div className='ta__container'>
    <div style={{'width': 32}}>
    <Avatar src={img} size={40}/>
    </div>
    <textarea 
        name="" 
        cols={20} 
        placeholder="What's happening"
        onChange={(e) => {
            props.setText(e.target.value);
        }}
        value={props.value}
        ></textarea>
   </div>
}