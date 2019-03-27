import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class NotFound extends Component{

    render(){
        return(
            <div>
                <Link to='/'><button className='btn btn-info'>Назад</button></Link>
                <h2 style={{textAlign: 'center'}}>Страница не найдена!</h2>
            </div>
        )
    }
}

export default NotFound;
