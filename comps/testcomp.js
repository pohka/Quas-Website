import Quas.FormHelper

export(
  class TestComp extends Component{
    constructor(){
      super();
      console.log("creating test");
      if(!TestComp.counter){
        TestComp.counter = 0;
      }
      this.state.counter = 0;
      this.store.name = "";
      this.store.abc = "";
      this.store.age = 0;
      this.store.car = "";
    }

    onSubmit(e){
      let inputData = FormHelper.onSubmit(e);
      console.log(inputData);
    }

    onClick(e){
      this.state.counter += 1;
    }

    onInput(e){

      console.log("input:" + e.target.value);
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
      let test = ['div',{},['test'],[]];

      return (
        #<div>
          <div q-if="true">test 1</div>
          <div q-else="true">test 2</div>
          <div q-if="false">test a</div>
          <div q-else-if="false">test 3</div>
          <div q-else-if="false">test 4</div>
          <div q-else><a href="abd">test 5</a></div>
          <br>
          <div>
            <input type="text" placeholder="input" q-store="abc">
            <div>output: {this.store.abc}</div>
          </div>

          <h2>appending?</h2>
          <div q-prepend="test" q-append="['world']">hello </div>
          <hr>

          // <ul>
          //   <li q-if="max > TestComp.counter">
          //     item {TestComp.counter}
          //   </li>
          //   <li q-if="true">{max}</li>
          // </ul>

          <div>
            <button q-if="this.state.counter%2 == 0" on-click="onClick">{this.state.counter}</button>
            <button q-else="" on-mouseleave="onClick"> -{this.state.counter}</button>
          </div>

          <form on-submit="onSubmit">
            <label>Name: </label><input type="text" name="fname" q-store="name">

            <label>Age: {this.store.age}</label><input type="number" value="0" name="age" min="0" max="100" q-store="age">

            <br><br>

            <label>What type of vehicle do you have?</label><br>
            <input type="checkbox" name="vehicle" value="Bike"> bike<br>
            <input type="checkbox" name="vehicle" value="Car"> car<br>
            <input type="checkbox" name="vehicle" value="Boat" checked> boat<br>

            <br><br>

            Email: <input type="email" name="email"><br>
            Pass: <input type="password" name="pass">

            <br><br>

            <select q-store="car" name="car">
              <option value="" disabled selected>Select Car</option>
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
            <div>{this.store.car}</div>

            <br>

            <input type="hidden" name="custId" value="3487">

            File : <input type="file" name="file"><br>

            <input type="radio" name="region" value="EU"> Europe<br>
            <input type="radio" name="region" value="NA"> North America<br>
            <input type="radio" name="region" value="SEA"> South East Asia<br>

            Search Google: <input type="search" name="q"><br>

            Add your homepage: <input type="url" name="homepage"><br>


            <input type="reset"><input type="submit" value="Submit">
          </form>

        // <ul q-template="['foo', {name : 'world'}]"></ul>
        // <ul q-template="['foo', user]"></ul>
        // <h2>Users over 18</h2>
        // <ul q-template-for="['display-user', users, 18]"></ul>
        //
        // <ul q-template-for="['display', animals]"></ul>
        </div>
      );
    }

    initTemplates(){
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
