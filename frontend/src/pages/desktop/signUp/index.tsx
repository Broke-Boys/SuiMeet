import react from 'react'
import './style.css';
import { Input } from '../../elements/input';
import { Button } from '../../elements/button';
import { ArrowRight } from '../../elements/icons/arrowRight';
import { Cross } from '../../elements/icons/crosss';
import { Decoration } from '../../elements/icons/decoration';
import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';
import { formatAddress } from '@mysten/sui.js';
import { subscribe } from 'diagnostics_channel';
import { ShortProfile } from '../../elements/shortPorifle';
import { useNavigate } from 'react-router-dom';
import { Divider } from 'antd';
import { createProfile, getProfileAddr } from '../../../client/createProfile';
import { uploadFile } from '../../../client/uploadFIle';
import { IDataShortProfile, getSuggestedProfiles } from '../../../service/getSuggestedProfiles';
import { follow } from '../../../client/follow';
import { unfollow } from '../../../client/unfollow';
import { Puff } from 'react-loader-spinner';
import {Avatar} from 'antd';


interface ISteps{
    currentStep: number;
    allSteps: number;
}

const Steps: react.FC<ISteps> = (props) => {
    return <div className='empty__container'>
        <div className="empty">
            <></>
        </div>
        <div className="steps__content">
            Step {props.currentStep} of {props.allSteps}
        </div>
        <div className="next">
            <></>
        </div>
    </div>
}

interface IRegStep{
    header: string;
    subheader: string;
    form: react.ReactElement[];
}

const RegStep: react.FC<IRegStep> = (props) => {
    return <>
        <span className='sign-up__header'>
            <span style={{fontWeight: 'bold'}}>{props.header}</span>
            <br />
            <span>{props.subheader}</span>
        </span>
        {props.form}
    </>
}

interface IShortProfileAdd extends IDataShortProfile{
    active: boolean;
}

const ShortProfileAdd: react.FC<IShortProfileAdd> = (props) => {
    const {signAndExecuteTransactionBlock} = useWalletKit();
    const [active, setActive] = react.useState(props.active);
    const activeClass = active ? 'active' : ''
    return <div className='short-profile_btn__container'>
        <ShortProfile 
        {...props}
        />
        <div className={'short-profile__btn ' + activeClass} onClick={() => {
            if (!active) {
                follow(
                    signAndExecuteTransactionBlock,
                    props.fullWallet
                )
            }
            else {
                unfollow(
                    signAndExecuteTransactionBlock,
                    props.fullWallet
                )
            }
            setActive(!active);
        }}>+</div>
    </div>
}


export const SignUp: react.FC = () => {
    const [currentStep, setCurrentStep] = react.useState(0);
    const {currentAccount} = useWalletKit();
    const {signAndExecuteTransactionBlock} = useWalletKit();
    const navigate = useNavigate();
    const [name, setName] = react.useState('');
    const [image, setImage] = react.useState('');
    const [imageLoaded, setImageIsLoaded] = react.useState(false);
    
    const queried = react.useRef(false);
    const [suggestedPeople, setSuggestedPeople] = react.useState<IDataShortProfile[]>([]);

    if (!queried.current && currentAccount?.address) {
        queried.current = true;
        getSuggestedProfiles().then((e) => {
            setSuggestedPeople(e!);
        })
    }
    
    var steps = [
        <RegStep 
            header='👋Hi there!'
            subheader='Firstly, enter your nickname'
            form={[
                <Input 
                    placeholder='Username'
                    onChange={(e) => setName(e)}
                />,
                <Button 
                    content={"Sign up"}
                    className=''
                    onClick={() => {
                        setCurrentStep(1);
                    }}
                />,
                <div className="or__block">
                    <div className="hor-sep or_block"></div>
                    <span className="or">or</span>
                    <div className="hor-sep or_block"></div>
                </div>,
                <Button 
                    content={"Log in"}
                    className='login_btn'
                    onClick={() => {
                        navigate('/login')
                    }}
                />
            ]}
        />,
        <RegStep 
            header='All Right'
            subheader='Connect your Sui wallet'
            form={[
                <ConnectButton 
                    connectText='Connect wallet'
                    connectedText={`Wallet connected`}
                    className='connected-btn__radius'
                />,
                <Button 
                    content={'Continute'}
                    className='cont-btn'
                    onClick={() => {
                        setCurrentStep(2);
                    }}
                />
            ]}
        />,
        <RegStep 
            header='👍Almost finished!'
            subheader='Please, upload profile photo'
            form={[
                <>
                    {
                        image.length ? 
                        <div className='centered'>
                            <Avatar 
                            src={image}
                            size={100}
                        />
                        </div> : <></>
                    }
                    <label htmlFor='photo-upload' className='label-photo'>
                        {
                            <div className='btn'>
                                {
                                    imageLoaded ? <Puff 
                                    width={16}
                                    height={16}
                                    color={'white'}
                                /> : <>Upload photo</>
                                }
                                
                            </div>
                        }
                    </label>
                    <input 
                        type='file' 
                        id='photo-upload' 
                        style={{display: 'none'}}
                        onChange={async (e) => {
                            setImageIsLoaded(true);
                            var link = await uploadFile(e.target.files![0]);
                            setImage(link);
                            setImageIsLoaded(false);
                        }}
                    />
                </>,
                <Button 
                    content={"Next"}
                    className='login_btn'
                    onClick={() => {
                        createProfile(
                            signAndExecuteTransactionBlock,
                            name,
                            image,
                            currentAccount?.address!
                        ).then((e) => {
                            setCurrentStep(3);
                        });
                    }}
                />
            ]}
        />,
        <RegStep 
            header='🏁Congratulations!🏁'
            subheader='Now choose some authors to follow'
            form={[
                <>
                    {
                        suggestedPeople.slice(0, 4).map(e => <ShortProfileAdd 
                        {...e}
                        active={false}
                        />) 
                    }
                </>,
                <Button 
                    content={'End Signing Up'}
                    className=''
                    onClick={() => {
                        navigate('/index')
                    }}
                />
            ]}
        />
    ]

    return <div className='sign-up__container'>
        <div className='decoration'>
            <Decoration />
        </div>
        <div className="sign-up__block">
            <Steps 
            currentStep={currentStep+1}
            allSteps={steps.length}
            />
            {steps[currentStep]}
        </div>
    </div>
}

export const Login: react.FC = () => {
    const navigate = useNavigate();
    const {currentAccount} = useWalletKit();
    return <div className='sign-up__container'>
    <div className='decoration'>
        <Decoration />
    </div>
    <div className="sign-up__block">
    <RegStep 
            header='Login'
            subheader='Connect your Sui wallet'
            form={[
                <ConnectButton 
                    connectText='Connect wallet'
                    connectedText={`Wallet connected`}
                    className='connected-btn__radius'
                />,
                <Button 
                    content={'Login'}
                    className='cont-btn'
                    onClick={async () => {
                        await getProfileAddr(currentAccount?.address!)
                        navigate('/index');
                    }}
                />,
                <div className="or__block">
                    <div className="hor-sep or_block"></div>
                    <span className="or">or</span>
                    <div className="hor-sep or_block"></div>
                </div>,
                <Button 
                content={"Sign up"}
                className='login_btn'
                onClick={() => {
                    navigate('/sign-up')
                }}
            />
                
            ]}
        />
    </div>
</div>
}