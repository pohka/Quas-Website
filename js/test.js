function ready(){
  let sam = new test();
  Quas.render(sam, "body");
  console.log(sam.vdom);
}


class test extends Component{
  constructor(){
    super();
    this.text = "part1";
    this.cls = "first";
    this.alt = true;
    this.items = ["item 2", "item 3"];
  }

  handleClick(e, comp){
  //  comp.items.push("another");
    comp.setProps({
      "text" : "AFF2",
      "alt" : !comp.alt
    });
    console.log("-----------clicked--------------");
  }

  hover(e, comp){
    console.log("-----------hover--------------");
  }

  getText(){
    return "rip";
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
          <div onclick=this.handleClick onmouseover=this.hover id="myid">
            <ul q-foreach-li=this.items>not</ul>
          </div>
        </quas>
      );
    }
  }
}
