
Quas.export(
  class TestComp extends Component{
    constructor(){
      super();
      this.templates = {
        foo : (
          #<div>hello</div>
        )
      }
      console.log("creating test");
    }

    render(){
      let val = 12;
      return (
        #<div>
          <ul>
            <li q-if="val > 10 && (val%2 == 0 || true)">item 1</li>
            <li q-if="true">{this.templates.foo}</li>
            <li q-if="false">{this.templates.foo}</li>
          </ul>
        </div>
      );
    }
  }
)
