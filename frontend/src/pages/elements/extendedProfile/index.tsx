import react from 'react'
import { ProfileDetail } from '../ProfileDetail'
import { ShortProfile } from '../shortPorifle'
import './style.css'
import { IDataFullProfile } from '../../desktop/main'


export const ExtendedProfile: react.FC<IDataFullProfile> = (props) => {

    return <div className='extended-profile__container'>
        <div className="extended-profile__head">
            <ShortProfile 
                {...props}
            />
            <div className="time">
                
            </div>
        </div>
        <div className="descr">
            {props.description}
        </div>
    </div>
}