import react from 'react';
import './style.css';


interface IButton{
    content: react.ReactElement | string;
    className: string;
    onClick?: () => void;
    disabled?: boolean;
}

export const Button: react.FC<IButton> = (props) => {
    var onClick = props.onClick;
    var disabledClass = props.disabled ? ' btn__disabled' : '';
    
    if (!onClick) {
        onClick = () => {}
    }
    return <button className={props.className + disabledClass} onClick={onClick}>
        {props.content}
    </button>
}