
Quas.export(
  class TestComp extends Component{
    constructor(){
      super();
      this.templates = {

      }
      console.log("creating test");
    }

    render(){
      return (
        #<div>
          <ul>
            <li q-if="{(true)}">item 1</li>
            <li q-if="{(false)}">item 2</li>
          </ul>
        </div>
      );
    }
  }
)
