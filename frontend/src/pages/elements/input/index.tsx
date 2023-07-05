import react from 'react'
import './style.css'
import { Search } from '../icons/search'

interface IInput{
    icon?: react.ReactElement;
    placeholder: string;
    onChange?: (e: string) => void;
    className?: string;
    value?: string;
}

export const Input: react.FC<IInput> = (props) => {
    const onChange = props.onChange ? props.onChange : (e: string) => {}
    const className = props.className ? props.className : '';
    const [value, setValue] = react.useState(props.value ? props.value : '');
    
    return <div className={'input__container ' + className}>
        {props.icon}
        <input 
            type="text" 
            placeholder={props.placeholder} 
            onChange={(e) => {
                onChange(e.target.value);
                setValue(e.target.value);
            }}
            value={props.value}
        />
    </div>
}