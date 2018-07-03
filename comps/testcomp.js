
Quas.export(
  class TestComp extends Component{
    constructor(){
      super();
      this.addTemplate("foo", (props) => {
         return #<div>hello {props}</div>
      });
      console.log("creating test");
    }

    render(){
      let val = 12;
      let animals = ["bird", "cat", "dog"];
      console.log("template:", this.getTemplate("foo"));
      return (
        #<div>
          <ul>
            <li q-if="val > 10 && (val%2 == 0 || true)">item 1</li>
            <li q-if="true">{val}</li>
            <li q-if="true">{this.getTemplate("foo", "world")}</li>
          </ul>
          //<ul q-fore="i in animals" q-template="foo" q-props=" name : 'world'"></ul>
          <ul q-fore="{[animals, 'foo', 'world']}"></ul>
        </div>
      );
    }
  }
)
