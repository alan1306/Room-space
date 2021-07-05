import {render} from 'react-dom';
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default class CreateRoomPage extends Component{
    static defaultProps={
        votesToSkip:2,
        guestCanPause:true,
        update:false,
        roomCode:null,
        updateCallback:() =>{},
    };
    constructor(props){
        super(props);
        this.state={
            guest_can_pause:this.props.guestCanPause,
            votes_to_skip:this.props.votesToSkip,
            errormsg:"",
            successmsg:"",
        };
        this.handleCreateRoom=this.handleCreateRoom.bind(this);
        this.handleGuestCanChange=this.handleGuestCanChange.bind(this);
        this.handleVotesChange=this.handleVotesChange.bind(this);
        this.handleUpdateRoom=this.handleUpdateRoom.bind(this);
    }
    handleVotesChange(e){
        this.setState({
            votes_to_skip:e.target.value,
        })
    }
    handleGuestCanChange(e){
        this.setState({
            guest_can_pause:e.target.value==="true"?true:false,
        })
    }
    
    handleCreateRoom() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            votes_to_skip: this.state.votes_to_skip,
            guest_can_pause: this.state.guest_can_pause,
          }),
        };
        fetch("/api/create", requestOptions)
          .then((response) => response.json())
          .then((data) =>this.props.history.push('/room/'+data.code));
      }
      handleUpdateRoom(){
          const requestOptions={
              method:"PATCH",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify({
                  guest_can_pause:this.state.guest_can_pause,
                  votes_to_skip:parseInt(this.state.votes_to_skip),
                  code:this.props.roomCode,
              }),
            };
            fetch("/api/update-room",requestOptions)
            .then((response)=>{
                if(response.ok){
                    this.setState({
                        successmsg:"Room updated successfully..!"
                    });
                }else{
                    this.setState({
                        errormsg:"Error while updating room..!"
                    });
                }
                this.props.updateCallBack()
            });
      }
      renderCreateRoom(){
          return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={this.handleCreateRoom}>
                Create Room
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
      renderUpdateRoom(){
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={this.handleUpdateRoom}>
                    Update Room
                </Button>
                </Grid>
            </Grid>
          );
      }
    render(){
        const title=this.props.update?"Update Room":"Create a Room"
        return(
            <Grid container spacing={1} >
                <Grid item xs={12} align="center">
                    <Collapse
                in={this.state.errormsg != "" || this.state.successmsg != ""}
                >
                {this.state.successMsg != "" ? (
                <Alert
                    severity="success"
                    onClose={() => {
                    this.setState({ successmsg: "" });
                    }}
                >
                    {this.state.successmsg}
                </Alert>
                ) : (
                <Alert
                    severity="error"
                    onClose={() => {
                    this.setState({ errormsg: "" });
                    }}
                >
                    {this.state.errormsg}
                </Alert>
                )}
            </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">
                                Guests can pause
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={this.state.guest_can_pause.toString()} onChange={this.handleGuestCanChange} >
                            <FormControlLabel 
                                value="true"
                                control={<Radio color="primary" />}
                                label="Allow"
                                
                            />
                            <FormControlLabel 
                                value="false"
                                control={<Radio color="secondary" />}
                                label="No control"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField 
                            required={true}
                            type="number"
                            onChange={this.handleVotesChange}
                            defaultValue={this.state.votes_to_skip}
                            inputProps={{
                                min:1,
                                style:{textAlign:"center"},
                            }}
                            
                        />
                        <FormHelperText>
                        <div align="center">
                            Votes to skip
                        </div>    
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update?this.renderUpdateRoom():this.renderCreateRoom()}
            </Grid>
        );
    }
}

const appDiv=document.getElementById("app")
render(<createRoomPage />,appDiv)