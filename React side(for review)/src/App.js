import React, {Component} from 'react';
import Main from './component/Main';
import Element from './component/Element';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NotFound from './component/NotFound';

class App extends Component{
    constructor(){
        super();
        this.state = {
            load: true,
            upData: false,
            obj: []
        };
    }


    takeData = () =>{
        fetch('/api/takeData')
            .then(res => res.json())
            .then(
                (result) =>{
                    this.setState({
                        obj: result
                    })
                },
                (error)=>{
                    console.log(error)
                }
            );
        this.setState({
            upDate: false
        })
    };

    link = () =>{
        return(
            <Switch>
                <Route exact path='/'
                   render={() => <Main updateData={this.updateData} obj={this.state.obj}/>}/>
            {this.state.obj.map((item, i) => {
                let url = '/' + item._id;
                return(

                    <Route key={i} path={url}
                           render={()=><Element updateData={this.updateData} obj={item}/>}/>
                )
            }, this)}
                <Route render={() => <NotFound/>}/>
            </Switch>
        )
    };

    componentDidMount(){
        this.takeData();
    }


    updateData = (value)=>{
        this.setState({
            upData: value
        });
        this.takeData()
    };


    render() {
        return (
            <Router>
                <div>
                    {this.link()}
                </div>
            </Router>

        )
    }
}

export default App;
