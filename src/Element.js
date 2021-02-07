//Array.from(document.querySelectorAll("i")).map(item=>{return item.className.substring(0,item.className.length-5);});
//to get semantic ui icons

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
  "black",
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

class Element extends Component {
  state = this.props.state;

  componentDidUpdate(prevProps, prevState) {
    if (prevState != this.state) {
      this.props.resize(this.props.num, this.state);
    }
  }

  render() {
    return (
      <Rnd
        onClick={() => this.props.handleClick(this.props.num)}
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0
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
        <Segment onClick={()=>{this.setState({color:this.state.color+1})}}
        inverted={true}
        tertiary={true}
        color={this.state.color===false?false:colors[this.state.color % 11]} style={{ height: "100%", width: "100%" }}></Segment>
      </Rnd>
    );
  }
}

export default Element;
