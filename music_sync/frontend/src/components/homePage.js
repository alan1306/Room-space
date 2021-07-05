import React,{Component} from "react";
console.log("helo");
import {render} from "react-dom";
import JoinRoomPage from './joinRoomPage';
import CreateRoomPage from './createRoomPage';
import Room from './room';
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
  } from "react-router-dom";

export default class HomePage extends Component{
    constructor(props){
        super(props);
        this.state={
            roomCode:null
        }
        this.clearRoomCode=this.clearRoomCode.bind(this);
    }
    async componentDidMount(){
        fetch('/api/check-user-in-room')
        .then((response)=>{
            if(response.ok){
                return response.json();
            }
        })
        .then((data)=>{
            console.log(data);
            this.setState({
                roomCode:data.code,
            });
        });
    }
    renderHomePage(){
        return(
            <Grid container spacing={2}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        Home
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                    <Button to='/create' component={Link}>
                        Create
                    </Button>
                    <Button to='/join' component={Link}>
                        Join
                    </Button>
                </ButtonGroup>
                </Grid>
            </Grid>
        );
    }
    render(){
        return(
            
            <Router>
                <Switch>
                <Route
            exact
            path="/"
            render={() => {
              return this.state.roomCode ? (
                <Redirect to={`/room/${this.state.roomCode}`} />) : (this.renderHomePage());}}/>
                    <Route  path='/join'
                        component={JoinRoomPage}>
                    </Route>
                    <Route path='/create'
                        component={CreateRoomPage}>
                    </Route>
                    <Route path='/room/:roomCode'
                       render={(props)=>{
                           return <Room {...props}leaveRoomCallback={this.clearRoomCode}/>;
                       }} >    
                    </Route>
                </Switch>
            </Router>
        
        );
    }
    clearRoomCode() {
        this.setState({
          roomCode: null,
        });
      }
}
