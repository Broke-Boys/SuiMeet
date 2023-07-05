import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom' 

function App() {
    const navigate = useNavigate();
    navigate('/index');

    useEffect(() => {
        navigate('/index')
    })
    
    return (
    <div className="App">
        asdf
    </div>
  );
}

export default App;
