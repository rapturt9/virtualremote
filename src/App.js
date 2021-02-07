import logo from './logo.svg';
import './App.css';
import serial from './serial.js';
import {Component} from 'react';
import { Divider, Header, Button, Segment, Input, Icon, Grid, Image, Message} from "semantic-ui-react";
import "./App.css";
import Element from './Element.js';
import ElementB from './ElementB.js';
import Icons from './Icons.js';
import Login from './Login.js';
import firebase from 'firebase';

let port = null;
let numResults = 0;

let clickInput=false;

let signal=false;


class App extends Component {

  state={email: false, connect: false, num: false, paste: false, sizes:[], name:"", message:0}

  componentDidMount () {
    serial.getPorts().then(ports => {
      if (ports.length === 0) {
        console.log('No device found.');
      } else {
        console.log('Connecting...');
        port = ports[0];
        this.connect();
      }
    });
    document.addEventListener('keydown', e => {
      if(e.code=="Backspace"){
        if(this.state.num!==false && !clickInput){
          let arr=this.state.sizes;
          console.log(this.state.num);
          console.log(arr.splice(this.state.num,1));
          this.setState({sizes:arr,num:false});
        }
      }
    });
    document.addEventListener('copy', event => {
      if(this.state.num!==false){
        //this.setState({copied: true});
        let copyObj = JSON.parse(JSON.stringify(this.state.sizes[this.state.num]));
        if(this.state.paste!=copyObj){
          copyObj.x=copyObj.x+20;
          copyObj.y=copyObj.y+20;
          this.setState({paste:copyObj});
          console.log("copy");
        }
      }
    });
    document.addEventListener('paste', event => {
      if(this.state.paste){
        console.log("paste");
        let arr=this.state.sizes;
        let oldPaste = this.state.paste;
        oldPaste.ID=Math.random();
        arr.push(this.state.paste);
        let paste = JSON.parse(JSON.stringify(this.state.paste));
        paste.x=paste.x+20;
        paste.y=paste.y+20;
        this.setState({sizes:arr, num: arr.length-1, paste:paste});
      }
    });
  }

  componentDidUpdate=(prevProps,prevState)=>{
    if(prevState.num!==this.state.num){
      console.log(this.state.num);
    }
  }

  handleClick = num => {
    clickInput=false;
    this.setState({num:num});
    console.log(num);
  }

  setRemotes = arr => {
    if(arr.length===2 && arr[1].json){
      this.setState({sizes:JSON.parse(arr[1].json), email:arr[0]});
    } else {
      this.setState({email:arr[0]});
    }
  }

  handleEnter = event => {
    if (event.keyCode === 13) {
      console.log('enter: '+this.state.name);
      if(this.state.num!==false){
        let arr = this.state.sizes;
        arr[this.state.num].icon = null;
        arr[this.state.num].text = null;
        if(Icons.includes(this.state.name)){
          arr[this.state.num].icon = this.state.name;
        } else {
          arr[this.state.num].text = this.state.name;
        }
        console.log(arr);
        this.setState({sizes:arr});
      }
    }
  }

  handleResize = (num,state) => {
    let obj=this.state.sizes;
    if(obj[num]!=state){
      obj[num]=state;
      this.setState({sizes:obj});
      console.log(obj);
    } 
  }

  sendSignal = val => {
    let view = new Uint8Array(5);
    let arr = val.split(",");
    view[0] = parseInt(arr[0]);
    let num = parseInt(arr[1]);
    for(let i=1;i<5;i++){
      view[i]=(num % 256);
      num=Math.floor(num/256);
    }
    console.log(view);
    port.send(view);
  }

  connect = () => {
    port.connect().then(() => {
        this.setState({connect: true});
        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          let sig = textDecoder.decode(data);
          console.log(sig);
          if(sig[0]!=="0"&&sig[2]!=="0"&&this.state.num!==false && signal){
            signal=false;
            let arr=this.state.sizes;
            arr[this.state.num].signal=sig;
            console.log(sig);
            this.setState({sizes:arr});
          }
        }
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        console.log(error);
      });
  }

  connectdevice = () => {
    console.log("connecting");
    if (port) {
      port.disconnect();
      port = null;
      this.setState({connect: false});
    } else {
      serial.requestPort().then(selectedPort => {
        port = selectedPort;
        console.log(port);
        this.connect();
      }).catch(error => {
        console.log(error);
      });
    }
  }

  handleInput = e => {
    this.setState({name:e.target.value});
  }
  
  render (){
    if(this.state.connect){
        return ( 
          <div>
            <MessageExampleDismissibleBlock header="Instructions" content="Click the remotes and buttons and customize the size and color of them. Use copy, paste, and delete functionality to streamline the process. Then record eachbutton with the remote."/>
            {this.state.message===1?<MessageExampleDismissibleBlock header="button" content="Click a button and type in the input to change its text. If you select one of the selectors, the button will show an icon instead. A full list of icons are here: https://semantic-ui.com/elements/icon.html#/icon."/>:false}
            {this.state.sizes.map((item,i) => {
              if(item.type===0){
                return <Element key={item.ID} resize={this.handleResize} handleClick={this.handleClick} num={i} state={item}/>;
              } 
              return <ElementB signal={this.sendSignal} key={item.ID} active={i===this.state.num} resize={this.handleResize} handleClick={this.handleClick} num={i} state={item}/>;
            })}
        <div className="bar">
          <Segment raised>
          <Grid columns={2} divided>
          <Grid.Row style={{padding:"10px"}}>
            {this.state.email ? <Button positive fluid onClick={()=>{
              firebase.firestore().collection('remotes').doc(this.state.email).set({
                json:JSON.stringify(this.state.sizes) });
            }}>Save</Button>:<Login/>}
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <div style={{height:"100px",width:"50px",backgroundColor:"grey",borderRadius:"5%"}} onClick={()=>{
                  let arr=this.state.sizes;
                  arr.push({ID: Math.random(),width:250,height:500,x:50,y:100, type:0, color:false});
                  console.log("push0");
                  this.setState({sizes:arr, num:arr.length-1});
                }}/>
              </Grid.Column>
              <Grid.Column>
                Remote
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
              <div style={{height:"30px",width:"50px",backgroundColor:"grey"}} onClick={()=>{
                  let arr=this.state.sizes;
                  arr.push({ID: Math.random(),width:50,height:30,x:50,y:100, type:1, color:false});
                  console.log("push1");
                  this.setState({sizes:arr, num:arr.length-1});
                }}></div>
                <br />
                <div style={{height:"50px",width:"50px",backgroundColor:"grey",borderRadius:"50%"}} onClick={()=>{
                  let arr=this.state.sizes;
                  arr.push({ID: Math.random(),width:40,height:40,x:50,y:100, type:2});
                  console.log("push2");
                  this.setState({sizes:arr, num:arr.length-1});
                }}></div>
              </Grid.Column>
              <Grid.Column>
                Button
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            <Grid.Column>
                <Button fluid compact icon={true} onClick={()=>{
                  if(this.state.num!==false){
                    let arr = this.state.sizes;
                    console.log(arr[this.state.num].color);
                    if(arr[this.state.num].color==undefined){
                      arr[this.state.num].color=0;
                    } else {
                      arr[this.state.num].color=arr[this.state.num].color+1;
                    }
                    this.setState({sizes:arr});
                  }
                  }}><Icon name="exchange"/> Color</Button>
              </Grid.Column>
              <Grid.Column>
              <Button fluid compact onClick={()=>{
                console.log("record");
                let arr=this.state.sizes;
                if(!signal && this.state.num!==false){
                  signal=true;
                  arr[this.state.num].signal=true;
                  this.setState({sizes:arr});
                }
              }}>Record</Button>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{padding:"10px"}}>
            
              <Input autoComplete="off" list='searchresults' id='search' placeholder='Add text/icon' onChange={this.handleInput} onKeyDown={this.handleEnter} value={this.state.name} onClick={()=>{
                clickInput=true;
                if(this.state.message!=1){
                  this.setState({message:1});
                }
              }}/>
    <datalist id='searchresults' >
      {Icons.map((val,i) => {
        if(i===0){
          numResults=0;
        }
        if(val.startsWith(this.state.name)&&numResults<5){
          numResults++;
          return <option key={val} value={val}>{val}</option>
        }
        })}
    </datalist>
            </Grid.Row>
          </Grid>
          </Segment>
        </div>
        </div>
        );
    }
    return (
      <div>
        <Header as="h2" icon textAlign="center">
          <br/>
          <Image size={"massive"} src="https://i.ibb.co/dg2Qz5w/Screen-Shot-2021-02-06-at-7-45-59-PM.png" alt="logo" />
           USB Virtual Remote
          <Header.Subheader>
      Connect your USB device to get started! Additionally, login with google here to save your remotes.
    </Header.Subheader>
        </Header>
        <Divider />
          <Button fluid onClick = {this.connectdevice}>{this.state.connect ? 'Connected':'Connect'}</Button>
        <br />
        {!this.state.email?<Login setRemotes={this.setRemotes}/>:false}
      </div>
    );
  }
}

class MessageExampleDismissibleBlock extends Component {
  state = { visible: true }

  handleDismiss = () => {
    this.setState({ visible: false })
  }

  render() {
    if (this.state.visible) {
      return (
        <Message
        style={{zIndex:2}}
          onDismiss={this.handleDismiss}
          header={this.props.header}
          content={this.props.content}
        />
      )
    }

    return (
      <div style={{height:0}}/>
    )
  }
}


export default App;
