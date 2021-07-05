import React,{Component} from "react";
import {render} from "react-dom";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import CreateRoomPage from "./createRoomPage";
export default class Room extends Component{
    constructor(props){
        super(props);
        this.state={
            guestCanPause:false,
            votesToSkip:2,
            isHost:false,
            showSettings:false
        }
        this.roomCode=this.props.match.params.roomCode;
        this.getRoomDetails();
        this.leaveButtonClicked=this.leaveButtonClicked.bind(this)
        this.settingsButtonClicked=this.settingsButtonClicked.bind(this)
        this.closeSettingsButtonClicked=this.closeSettingsButtonClicked.bind(this)
        this.getRoomDetails=this.getRoomDetails.bind(this);
    }
    getRoomDetails(){
        fetch("/api/get-room"+"?code="+this.roomCode)
        .then((response)=>{
            if(!response.ok){
                console.log(response);
                this.props.history.push(`/`);
                throw Error("Room not found");
                
            }
            return response.json();
        })
        .then((data)=>{
            this.setState({
                guestCanPause:data.guest_can_pause,
                votesToSkip:data.votes_to_skip,
                isHost:data.isHost,
            })
        })
        .catch(err =>{
            console.log(err.message);
        });
    }
    renderSettingsPage(){
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        guestCanPause={this.state.guestCanPause}
                        votesToSkip={this.state.votesToSkip}
                        roomCode={this.roomCode}
                        updateCallBack={this.getRoomDetails}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.closeSettingsButtonClicked}>
                    close
                    </Button>
                </Grid>
            </Grid>
        );
    }
    render(){
        if (this.state.isHost && this.state.showSettings){
            return this.renderSettingsPage(); 
        }
        else{
        return(
            <Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h6" variant="h6">
                        code:{this.roomCode}
                    </Typography>
                 </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h6" variant="h6">
                        Votes to pause:{this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h6" variant="h6">
                        Can Guest Pause!??:{this.state.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h6" variant="h6">
                        Host: {this.state.isHost.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" onClick={this.leaveButtonClicked}>
                        Leave
                    </Button>
                    <Button color="blue" id="settingsButton" onClick={this.settingsButtonClicked}>
                <SettingsIcon />
            </Button>
                </Grid>
            </Grid>
        )};
        }
        leaveButtonClicked(){
           const requestOptions={
                method:"POST",
                headers: { "Content-Type": "application/json" },
            }
            fetch('/api/leave-room',requestOptions)
            .then((response)=>{
                if(response.ok){
                    this.props.history.push(`/`);
                }
            });
        }
        settingsButtonClicked(){
            if (this.state.isHost){
            this.setState({
                showSettings:true,
            })
        }
        }
        closeSettingsButtonClicked(){
            this.setState({
                showSettings:false,
            })
        }
}
