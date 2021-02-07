import { Rnd } from "react-rnd";
import { Component } from "react";
import {
  Divider,
  Header,
  Button,
  Segment,
  Input,
  Icon,
  Grid,
  Image,
} from "semantic-ui-react";

const colors = [
  "grey",
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "olive",
  "teal",
  "violet",
  "pink",
  "purple",
  "brown",
];

class ElementB extends Component {
  state = this.props.state;

  componentDidUpdate(prevProps, prevState) {
    if (prevState != this.state) {
      console.log("resize");
      this.props.resize(this.props.num, this.state);
    } else if(prevProps.active!=this.props.active || prevProps.icon!=this.props.icon ||prevProps.text!=this.props.text){
      console.log("active: "+this.props.active+", "+this.props.num);
      this.setState({});
    }
  }

  render() {
    return (
      <Rnd
        onClick={() => {
          console.log("click");
          this.props.handleClick(this.props.num)
        }}
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            borderRadius: this.state.type===1?"0%":"50%"
          }}
        size={{ width: this.state.width, height: this.state.height }}
        position={{ x: this.state.x, y: this.state.y }}
        onDragStop={(e, d) => {
          this.setState({ x: d.x, y: d.y });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          this.setState({
            width: ref.style.width,
            height: ref.style.height,
            ...position,
          });
        }}
      >
        <Button compact loading={this.state.signal===true} disabled={!(typeof this.state.signal === 'string')} active={this.props.active} icon={this.props.icon?true:false} color={this.state.color===false?false:colors[this.state.color % 11]}  style={{ height: "100%", width: "100%", borderRadius: this.state.type===1?"0%":"50%" }} onClick={()=>{
          if(typeof this.state.signal === 'string'){
            this.props.signal(this.state.signal);
          }
        }}>
          {this.state.signal!==true && this.props.state.icon?<Icon name={this.props.state.icon}/>:false}
          {this.state.signal!==true ? this.props.state.text: "Loading"}
      </Button>
      </Rnd>
    );
  }
}

export default ElementB;
