function ready(){
  Quas.render(new test(), "body");
}


class test extends Component{
  constructor(){
    super();
    this.text = "hello";
    this.cls = "first";
    this.alt = false;
  }

  handleClick(e, comp){
    comp.setProps({
      "text" : "test",
      "alt" : true
    });
    console.log("clicked");
  }

  render(){
    if(!this.alt){
      return (
        <quas>
          <div onclick=this.handleClick class="{this.cls}">{this.text}</div>
        </quas>
      );
    }
    else{
      return (
        <quas>
          <div onclick=this.handleClick id="myid">{this.text}
            <span>after</span>
          </div>
        </quas>
      );
    }
  }
}
