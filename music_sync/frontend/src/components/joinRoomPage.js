import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import MenuItem from '@material-ui/core/MenuItem';
export default class JoinRoomPage extends Component{
    constructor(props){
        super(props);
        this.state={
            allRoomCodes:[],
            roomCode:''
        };
        this.handleRoomCodeEntered=this.handleRoomCodeEntered.bind(this)
        this.handleJoinRoom=this.handleJoinRoom.bind(this)
    }   
    async componentDidMount(){
        const response=await fetch('/api/get-all-room-codes');
        const data=await response.json()
        console.log(data,typeof(data));
        this.setState({
            allRoomCodes:data
        });


    }
    render(){
        return(
            <Grid container spacing={2}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Join Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        select
                        label="Code"
                        value={this.state.roomCode}
                        onChange={this.handleRoomCodeEntered}
                        helperText="Enter the Room Code"
                        variant="outlined"
                    >    
                    {this.state.allRoomCodes && this.state.allRoomCodes.length>0 && this.state.allRoomCodes.map((option) =>(
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick={this.handleJoinRoom}>
                    Join Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                    </Button>
                </Grid>
            </Grid>
        );
    }
    handleRoomCodeEntered(e){
        this.setState({
            roomCode:e.target.value,
        });
    }
    handleJoinRoom() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: this.state.roomCode,
          }),
        };
        fetch("/api/join-room", requestOptions)
          .then((response) => {
            if (response.ok) {
              this.props.history.push(`/room/${this.state.roomCode}`);
            } else {
              this.setState({ error: "Room not found." });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
}