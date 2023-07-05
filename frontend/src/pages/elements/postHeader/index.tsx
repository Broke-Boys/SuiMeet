import react from 'react'
import './style.css';

interface ISelect{
    types: string[];
    typeChange: (type: string) => void;
    vertical?: boolean;
    selected?: string;
}


export const Select: react.FC<ISelect> = (props) => {
    const [selected, setSelected] = react.useState(props.selected ? props.selected : props.types[0]);
    const verticalClass = props.vertical ? ' header__vertical' : ''
    return <div className={"post-header__btns" + verticalClass}>
            {
                props.types.map((e) => {
                    return <span
                        className={
                            'post-header__btn ' + (selected.split(' ')[0] == e.split(' ')[0] ? "post-header__btn-active" : "") 
                        }
                        onClick={() => {
                            setSelected(e as any);
                            props.typeChange(e as any);
                        }}
                    >{e}</span>
                })
            }
        </div>
}


interface IPostHeader{
    news: number;
    postTypeChange: (
        type: "Most relevant" | "Rating" | "Popolarity"
    ) => void
}

export const PostHeader: react.FC<IPostHeader> = (props) => {
    var types = ["Most relevant", "Rating", "Popolarity"]

    return <div className='post-header__container'>
        {/* <span>
            {props.news} news
        </span>
        <Select 
            types={types}
            typeChange={props.postTypeChange as any}
        /> */}
    </div>
}