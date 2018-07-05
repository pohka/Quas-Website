
Quas.export(
  class TestComp extends Component{
    constructor(){
      super();
      this.createTemplates();
      console.log("creating test");
      if(!TestComp.counter){
        TestComp.counter = 0;
      }
    }

    render(){
      let max = 3;
      let animals = ["bird", "cat", "dog"];
      let user = {name : "john", age : 18};
      let users = [
        { name : "john", age : 18 },
        { name : "tim", age : 12 },
        { name : "sofia", age : 24 }
      ];

      TestComp.counter++;
    //  console.log("RENDERING TESTCOMP", this.counter);


      return (
        #<div>
          <ul>
            <li q-if="max > TestComp.counter">
              item {TestComp.counter}
            </li>
            <li q-if="true">{max}</li>
          </ul>

        // <ul q-template="['foo', {name : 'world'}]"></ul>
        // <ul q-template="['foo', user]"></ul>
        // <h2>Users over 18</h2>
        // <ul q-template-for="['display-user', users, 18]"></ul>
        //
        // <ul q-template-for="['display', animals]"></ul>
        </div>
      );
    }

    createTemplates(){
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
    }
  }
);
