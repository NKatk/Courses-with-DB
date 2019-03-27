const express = require('express');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();


// установка схемы
const courseDataSchema = new Schema({
    courseName: {
        type: String,
        unique: true
    },
    description: String,
    participantsCourse: [{
        name: String,
        dateBirth: Date,
        phone: Number,
        mail: String,
        dateCreate: Date
    }]
}, {versionKey: false});

// подключение
mongoose.connect("mongodb://localhost:27017/courseData",{useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true});

const CourseData = mongoose.model("CourseData", courseDataSchema);


//статический файл
app.use(express.static('public'));

//обработка fetch запросов
//получение всех курсов
app.get('/api/takeData', (req, res) => {
    CourseData.find({}, (err, result) => {
        //mongoose.disconnect();
        if (err) return console.log(err);
        res.end(JSON.stringify(result));
    })
});

//удаление курса
app.delete('/api/deleteElement', jsonParser, (req, res)=>{

    CourseData.findByIdAndDelete(req.body.id, (err, result)=> {
        if (err) {
            console.log(err);
        } else if (result === null) {
            res.end(JSON.stringify({msg:'ERR deleted'}));
            return console.log('ERR deleted')
        } else {
            res.end(JSON.stringify({msg:'OK'}))
        }
    });
});

//создание курса
app.post('/api/createElement', jsonParser, (req, res)=>{
    const dateCourse = req.body;

    const courseData = new CourseData({
        courseName: dateCourse.courseName,
        description: dateCourse.description,
        participantsCourse: []
    });


    courseData.save(function(err) {
        if(err) {
            if (err.code === 11000) {
                res.end(JSON.stringify({msg:'Value Not Unique'}))
            } else {
                res.end(JSON.stringify({msg:'DB Err'}))
            }
        }else{
            res.end(JSON.stringify({msg:'OK'}))
        }

    });
});

//изменение курса
app.put('/api/changeElement', jsonParser, (req, res)=>{

    const dateCourse = req.body;

    CourseData.findOneAndUpdate({_id: dateCourse.id}, dateCourse, (err)=>{
        if (err) {
            if (err.code === 11000) {
                res.end(JSON.stringify({msg:'Value Not Unique'}))
            } else {
                res.end(JSON.stringify({msg:'DB Err'}))
            }
        }else{
            res.end(JSON.stringify({msg:'OK'}))
        }
    });
});

//удаление члена курса
app.delete('/api/deletePerson', jsonParser, (req, res)=>{
    CourseData.findByIdAndUpdate(req.body.idCourse,{$pull:{participantsCourse: {_id:req.body.idPerson}}}, (err, result)=>{
        if (err) {
            res.end(JSON.stringify({msg:'DB Err'}));
            return console.log(err);
        } else if (result === null) {
            res.end(JSON.stringify({msg:'ERR deleted'}));
            return console.log('ERR deleted')
        } else {
            res.end(JSON.stringify({msg:'OK'}))
        }

    });
});

//создание члена курса
app.post('/api/createPerson', jsonParser, (req, res)=>{
    const idDoc = req.body[0].idCourse;
    const obj = req.body[1];

    const createPerson = (idCourse, obj) => {
        const datePerson = obj;

        let dateCreate = new Date();
        datePerson.dateCreate = dateCreate;

        //создание
        CourseData.findOneAndUpdate({_id: idCourse},
            {'$push':{'participantsCourse': datePerson}}, (err, result)=>{
                if (err){
                    if(err.reason.path === 'dateBirth'){
                        res.end(JSON.stringify({msg:'ERR dateBirth'}));
                        return console.log('ERR dateBirth');
                    }else if(err.reason.path === 'phone'){
                        res.end(JSON.stringify({msg:'ERR phone'}));
                        return console.log('ERR phone');
                    }else if(err.reason.path === 'dateCreate'){
                        res.end(JSON.stringify({msg:'ERR dateCreate'}));
                        return console.log('ERR dateCreate');
                    }else{
                        res.end(JSON.stringify({msg:'DB Err'}));
                        return console.log('DB Err');
                    }
                }else{
                    res.end(JSON.stringify({msg:'OK'}))
                }
            })
    };


    //проверка на уникальность
    CourseData.findById(idDoc, (err, result) => {
        if (err) res.end(JSON.stringify({msg:'DB Err'}));
        let phone = [],
            mail = [];

        if(result.participantsCourse.length === 0){
            createPerson(idDoc, obj);
        }else {
            for (let i = 0; i < result.participantsCourse.length; i++) {
                phone[i] = result.participantsCourse[i].phone;
                mail[i] = result.participantsCourse[i].mail;
            }

            if (phone.indexOf(+obj.phone) !== -1) {
                res.end(JSON.stringify({msg:'ERR unique phone'}))
            } else if (mail.indexOf(obj.mail) !== -1) {
                res.end(JSON.stringify({msg:'ERR unique mail'}))
            } else {
                createPerson(idDoc, obj);
            }
        }

    })
});

//Изменение члена курса
app.put('/api/changePerson', jsonParser, (req, res)=>{
    const idDoc = req.body[0].idCourse;
    const obj = req.body[1];


    const changePerson = (idCourse, obj) => {
        const datePerson = obj;

        //изменение
        CourseData.findOneAndUpdate({_id: idCourse},
            {'$set':{'participantsCourse.$[element]': datePerson}},
            {'arrayFilters': [{'element._id': datePerson.id }]},
            (err, result)=>{
                if (err){
                    if(err.reason.path === 'dateBirth'){
                        res.end(JSON.stringify({msg:'ERR dateBirth'}));
                        return console.log('ERR dateBirth');
                    }else if(err.reason.path === 'phone'){
                        res.end(JSON.stringify({msg:'ERR phone'}));
                        return console.log('ERR phone');
                    }else if(err.reason.path === 'dateCreate'){
                        res.end(JSON.stringify({msg:'ERR dateCreate'}));
                        return console.log('ERR dateCreate');
                    }else{
                        res.end(JSON.stringify({msg:'DB Err'}));
                        return console.log('DB Err');
                    }
                }else{
                    res.end(JSON.stringify({msg:'OK'}))
                }

            });
    };


    //проверка на уникальность
    CourseData.findById(idDoc, (err, result) => {
        if (err) res.end(JSON.stringify({msg:'DB Err'}));
        let phone = [],
            mail = [];

        if(result.participantsCourse.length === 0){
            changePerson(idDoc, obj);
        }else {
            for (let i = 0; i < result.participantsCourse.length; i++) {
                let parId = result.participantsCourse[i]._id + '';
                if (parId === obj.id){
                    continue;
                }
                phone.push(result.participantsCourse[i].phone);
                mail.push(result.participantsCourse[i].mail);
            }

            if (phone.indexOf(+obj.phone) !== -1) {
                res.end(JSON.stringify({msg:'ERR unique phone'}))
            } else if (mail.indexOf(obj.mail) !== -1) {
                res.end(JSON.stringify({msg:'ERR unique mail'}))
            } else {
                changePerson(idDoc, obj);
            }
        }

    })

});


//при обновление страницы отдавать главную страницу а не 404
app.get('*', (req, res)=>{
    res.sendfile(__dirname + '/public/index.html')
});


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));


