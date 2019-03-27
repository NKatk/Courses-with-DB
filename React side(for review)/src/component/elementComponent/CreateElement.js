import React, {Component} from 'react';

class CreateElement extends Component {
    constructor(){
        super();
    }

    createDataPersone = () =>{
        let dataForm = document.getElementById('dataForm');

        if (!!dataForm.name.value && !!dataForm.dateBirth.value && !!dataForm.phone.value && !!dataForm.mail.value) {
            fetch('/api/createPerson',  {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([{
                    idCourse: this.props.id
                },{
                    name: dataForm.name.value,
                    dateBirth: dataForm.dateBirth.value,
                    phone: dataForm.phone.value,
                    mail: dataForm.mail.value
                }])
            })
                .then(res => res.json())
                .then(
                    (result) =>{
                        if(result.msg === 'OK'){
                            alert('Создание успешно.');
                            this.props.updateData(true);
                            this.props.createPerson(false)
                        }else if(result.msg ==='ERR unique phone'){
                            alert('Номер не уникален, измените значение.');
                        }else if(result.msg ==='ERR unique mail'){
                            alert('Почта не уникальна, измените значение.');
                        }else if(result.msg ==='ERR dateBirth'){
                            alert('Дата рождения не корректна, измените значение.');
                        }else if(result.msg ==='ERR phone'){
                            alert('Номер телефона не корректен, измените значение..');
                        }else if(result.msg ==='ERR dateCreate'){
                            alert('Ошибка баз данных."Создание даты".');
                            this.props.updateData(true);
                            this.props.createPerson(false)
                        }else if(result.msg = 'DB Err'){
                            alert('Ошибка баз данных.');
                            this.props.updateData(true);
                            this.props.createPerson(false)
                        }

                    },
                    (error)=>{
                        console.log(error);
                        this.props.updateData(true);
                        this.props.createPerson(false)
                    }
                )

        }else{
            alert('Заполните все ячейки!')
        }
    };


    form = () =>{
        return (
            <form id='dataForm'>
                <div className="form-group row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">ФИО</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" name="name" id="name"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="dateBirth" className="col-sm-2 col-form-label">Дата рождения</label>
                    <div className="col-sm-10">
                        <input type="date" className="form-control" name="dateBirth" id="dateBirth"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="phone" className="col-sm-2 col-form-label">Телефон<span style={{color: 'red'}}>*</span></label>
                    <div className="col-sm-10">
                        <input type="number" className="form-control" name="phone" id="phone"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="mail" className="col-sm-2 col-form-label">Почта<span
                        style={{color: 'red'}}>*</span></label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" name="mail" id="mail"/>
                    </div>
                </div>
                <div id="buttons">
                    <span id="buttonCreate" className="btn btn-sm btn-primary" onClick={()=>this.createDataPersone()}>Сохранить</span>
                    <span id="buttonCancel" className="btn btn-sm btn-warning" onClick={()=>{this.props.createPerson(false);
                                                                                             this.props.updateData(true)}}>Отменить</span>
                </div>
                <div><span style={{color: 'red'}}>*</span> - <i>Уникальное значение</i></div>
            </form>
        )
    };

    render(){
        return(
            this.form()
        )
    }
}


export default CreateElement;
