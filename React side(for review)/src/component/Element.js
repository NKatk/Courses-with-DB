import React, {Component} from 'react';
import {Link, BrowserRouter}  from 'react-router-dom';
import CreateElement from './elementComponent/CreateElement'
import ChangeElement from './elementComponent/ChangeElement'

class Element extends Component{
    constructor(){
        super();
        this.state ={
            create: false,
            change: null
        }
    }


    deletePerson = (val)=>{
        let answer = confirm(`Вы хотитете удалить "${val.name}"?`);

        if(answer){
            fetch('/api/deletePerson',  {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({idCourse: this.props.obj._id, idPerson:val._id})
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


    createPerson = (val)=>{
        this.setState({
            create: val
        })
    };

    changePerson = (val)=>{
        this.setState({
            change: val
        })
    };

    table = () => {
        return (
            <table className="table table-bordered">
                <thead style={{backgroundColor: '#bbdcfd'}}>
                <tr>
                    <th style={{width: '25%'}}>ФИО</th>
                    <th style={{width: '15%'}}>Дата рождения(гггг-мм-чч)</th>
                    <th style={{width: '15%'}}>Телефон</th>
                    <th style={{width: '15%'}}>Почта</th>
                    <th style={{width: '10%'}}>Дата регистрации(гггг-мм-чч)</th>
                </tr>
                </thead>
                <tbody>
                {this.props.obj.participantsCourse.map((item, i)=>{
                    return(
                        <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.dateBirth.slice(0,10)}</td>
                            <td>{item.phone}</td>
                            <td>{item.mail}</td>
                            <td>{item.dateCreate.slice(0,10)}</td>
                            <td className='text-right'>
                                <div className='btn-group'>
                                    <button className='btn btn-success' onClick={()=>this.changePerson(item)}>Изменить</button>
                                    <button className='btn btn-danger' onClick={()=>this.deletePerson(item)}>Удалить</button>
                                </div>
                            </td>
                        </tr>
                    )
                },this)}
                </tbody>
                <tfoot >
                <tr>
                    <td colSpan="6" className="text-center">
                        <button id="createBtn" className="btn btn-primary btn-block" onClick={()=>this.createPerson(true)}>Добавить</button>
                    </td>
                </tr>
                </tfoot>
            </table>
        )
    };


    render(){
        const {create, change} = this.state;
        if(create){
            return(
                <CreateElement createPerson={this.createPerson} updateData={this.props.updateData} id={this.props.obj._id}/>
            )
        }else if(change){
            return(
                <ChangeElement changePerson={this.changePerson} updateData={this.props.updateData} id={this.props.obj._id}  change={this.state.change}/>
            )
        }else{
            return(
                <div>
                    <h1 style={{textAlign: 'center'}}>{this.props.obj.courseName}</h1>
                    <Link to='/'><button className='btn btn-info'>Back</button></Link>
                    {this.table()}
                </div>
            )
        }

    }
}


export default Element
