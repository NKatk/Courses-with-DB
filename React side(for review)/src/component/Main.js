import React, {Component} from 'react';
import {Link, BrowserRouter}  from 'react-router-dom';
import CreateMain from './mainComponent/CreateMain'
import ChangeMain from './mainComponent/ChangeMain'

class Main extends Component{
    constructor(){
        super();
        this.state = {
            load: true,
            create: false,
            change: null
        }
    }

    deleteElement = (val) => {
        let answer = confirm(`Выдействительно хотите удалить курс "${val.courseName}"?`);

        if(answer){
            fetch('/api/deleteElement',  {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id:val._id})
            })
                .then(res => res.json())
                .then(
                    (result) =>{
                        if(result.msg === 'OK'){
                            alert('Удаление успешно.');
                            this.props.updateData(true)
                        }else if(result.msg === 'ERR deleted'){
                            alert('Ошибка баз данных.');
                            this.props.updateData(true);
                        }else if (result.msg = 'DB Err') {
                            alert('Ошибка баз данных.');
                            this.props.updateData(true);
                        }

                    },
                    (error)=>{
                        console.log(error);
                        this.props.updateData(true)
                    }
                )
        }
    };


    changeElement = (value) =>{
        this.setState({
            change: value
        })

    };

    createElement =(value)=>{
        this.setState({
            create: value
        })
    };


    table =()=>{
        return (
            <div>
                <table className='table table-bordered'>
                    <thead style={{backgroundColor: '#bbdcfd'}}>
                    <tr>
                        <th style={{width: '30%'}}>Название</th>
                        <th style={{width: '45%'}}>Описание</th>
                        <th style={{width: '5%'}}>Количество учасников</th>
                    </tr>
                    </thead>
                    <tbody style={{backgroundColor: 'white'}}>
                    {this.props.obj.map(function (items, i) {
                        return (
                            <tr key={i}>
                                <td>{items.courseName}</td>
                                <td>{items.description}</td>
                                <td>{items.participantsCourse.length}</td>
                                <td className='text-right'>
                                    <div className='btn-group'>
                                        <Link to={items._id}>
                                            <button className='btn btn-info'>Перейти</button>
                                        </Link>
                                        <button className='btn btn-success' onClick={()=>this.changeElement(items)}>Изменить</button>
                                        <button className='btn btn-danger' onClick={()=>this.deleteElement(items)}>Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        )
                    },this)}
                    </tbody>
                    <tfoot >
                    <tr>
                        <td colSpan="4" className="text-center">
                            <button id="createBtn" className="btn btn-primary btn-block" onClick={()=>this.createElement(true)}>Добавить</button>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        )
    };



    render(){
        const {load, create, change} = this.state;

        if(create){
            return(
                <CreateMain createElement={this.createElement} updateData={this.props.updateData}/>
            )
        }else if(change){
            return(
                <ChangeMain changeElement={this.changeElement} change={this.state.change} updateData={this.props.updateData}/>
            )
        }else{
            return(
                <div>
                    <h1 style={{textAlign: 'center'}}>MongoDB</h1>
                    {this.table()}
                </div>

            )
        }
    }
}

export default Main;
