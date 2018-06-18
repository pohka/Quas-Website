var sam;
function ready(){
  sam = new test();
  Quas.render(sam, "body");
  console.log(sam.vdom);
}


class test extends Component{
  constructor(){
    super();
    this.text = "part1";
    this.cls = "first";
    this.alt = false;
  }

  handleClick(e, comp){
    comp.setProps({
      "text" : "AFF2",
      "alt" : !comp.alt
    });
    console.log("-----------clicked--------------");
  }

  getText(){
    return "rip";
  }

  render(){
    console.log("is alt:" +  this.alt);
    if(!this.alt){
      return (
        <quas>
          <div onclick=this.handleClick class="{this.cls}">
            {"before ", this.getText(), " after ", this.text}
            <div id="1">another</div>
            <div id="2">another</div>
            <div  id="3">another</div>

          </div>
        </quas>
      );
    }
    else{
      return (
        <quas>
          <div onclick=this.handleClick id="myid">
            <div>not</div>
          </div>
        </quas>
      );
    }
  }
}
