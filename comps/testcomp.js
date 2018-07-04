
Quas.export(
  class TestComp extends Component{
    constructor(){
      super();
      this.addTemplate("foo", (props) => {
         return #<div>hello {props.name}</div>
      });
      this.addTemplate("display-user", (user, ageMin) => {
         return (
           #<div q-if="user.age >= ageMin">
           hello {user.name}, you are {user.age}
           </div>
         );
      });
      this.addTemplate("display", (name) =>{
        return #<div>The big <span id="big">{name}</span></div>;
      });
      console.log("creating test");
    }

    render(){
      let val = 12;
      let animals = ["bird", "cat", "dog"];
      let user = {name : "john", age : 18};
      let users = [
        { name : "john", age : 18 },
        { name : "tim", age : 12 },
        { name : "sofia", age : 24 }
      ];
    //  console.log("template:", this.genTemplate("foo"));
      return (
        #<div>
          <ul>
            <li q-if="val > 10 && (val%2 == 0 || true)">item 1</li>
            <li q-if="true">{val}</li>
          //  <li q-if="true">{this.genTemplate(['foo', {name : 'world'}])}</li>
          </ul>
          //<ul q-fore="i in animals" q-template="foo" q-props=" name : 'world'"></ul>
        //  <ul q-fore="{[animals, 'foo', 'world']}"></ul>

        <ul q-template="['foo', {name : 'world'}]"></ul>
        <ul q-template="['foo', user]"></ul>
        <h2>Users over 18</h2>
        <ul q-template-for="['display-user', users, 18]"></ul>

        <ul q-template-for="['display', animals]"></ul>
        </div>
      );
    }
  }
)
