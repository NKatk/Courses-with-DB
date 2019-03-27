import React, {Component} from 'react';

class ChangeElement extends Component {
    constructor(){
        super();
    }

    changeDataPerson = () =>{
        let dataForm = document.getElementById('dataForm');

        if(dataForm.name.value === this.props.change.name &&
            dataForm.dateBirth.value === this.props.change.dateBirth.slice(0,10) &&
            +dataForm.phone.value === this.props.change.phone &&
            dataForm.mail.value === this.props.change.mail
        ) {
            alert('Изменения не внесены!');
            this.props.changePerson(false);
            this.props.updateData(true)


        }else {
            if (!!dataForm.name.value && !!dataForm.dateBirth.value && !!dataForm.phone.value && !!dataForm.mail.value) {
                fetch('/api/changePerson', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify([{
                        idCourse: this.props.id
                    }, {
                        id: this.props.change._id,
                        name: dataForm.name.value,
                        dateBirth: dataForm.dateBirth.value,
                        phone: dataForm.phone.value,
                        mail: dataForm.mail.value,
                        dateCreate: this.props.change.dateCreate
                    }])
                })
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if (result.msg === 'OK') {
                                alert('Изменение успешно.');
                                this.props.updateData(true);
                                this.props.changePerson(false)
                            } else if (result.msg === 'ERR unique phone') {
                                alert('Номер не уникален, измените значение.');
                            } else if (result.msg === 'ERR unique mail') {
                                alert('Почта не уникальна, измените значение.');
                            } else if (result.msg === 'ERR dateBirth') {
                                alert('Дата рождения не корректна, измените значение.');
                            } else if (result.msg === 'ERR phone') {
                                alert('Номер телефона не корректен, измените значение..');
                            } else if (result.msg === 'ERR dateCreate') {
                                alert('Ошибка баз данных."Создание даты".');
                                this.props.updateData(true);
                                this.props.changePerson(false)
                            } else if (result.msg = 'DB Err') {
                                alert('Ошибка баз данных.');
                                this.props.updateData(true);
                                this.props.changePerson(false)
                            }

                        },
                        (error) => {
                            console.log(error);
                            this.props.updateData(true);
                            this.props.changePerson(false)
                        }
                    )

            } else {
                alert('Заполните все ячейки!')
            }
        }
    };


    form = () =>{
        return (
            <form id='dataForm'>
                <div className="form-group row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">ФИО</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" name="name" id="name" defaultValue={this.props.change.name}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="dateBirth" className="col-sm-2 col-form-label">Дата рождения</label>
                    <div className="col-sm-10">
                        <input type="date" className="form-control" name="dateBirth" id="dateBirth" defaultValue={this.props.change.dateBirth.slice(0,10)}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="phone" className="col-sm-2 col-form-label">Телефон<span style={{color: 'red'}}>*</span></label>
                    <div className="col-sm-10">
                        <input type="number" className="form-control" name="phone" id="phone" defaultValue={this.props.change.phone}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="mail" className="col-sm-2 col-form-label">Почта<span
                        style={{color: 'red'}}>*</span></label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" name="mail" id="mail" defaultValue={this.props.change.mail}/>
                    </div>
                </div>
                <div id="buttons">
                    <span id="buttonCreate" className="btn btn-sm btn-primary" onClick={()=>this.changeDataPerson()}>Сохранить</span>
                    <span id="buttonCancel" className="btn btn-sm btn-warning" onClick={()=>{this.props.changePerson(false);
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


export default ChangeElement;
