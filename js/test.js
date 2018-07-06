import Router from "/quas/modules/router.js"

function test(name){
  let bracket = "</>";
  return #<span>{name} from here? \>{bracket}</span>;
}

function ready(){
  test2();
}

class Sample extends Component{
  constructor(){
    super({
      counter : 0
    });
    this.addTemplate("foo", (item)=>{
      return (
        #<li q-if="item < 2">item {item}</li>
      );
    })
  }

  onPush(){
    console.log("pushed");
  }

  render(){
    this.props.counter++;
    let items = [
      1,
      2,
      3,
      4
    ];

    let limit = 30;
    return (
      #<div q-if="this.props.counter <= limit">
        Disappears in {(limit - this.props.counter + 1)}
        <a href="/" target="push"><button>click to push</button></a>
        <h2>My list</h2>
        <ul q-template-for="['foo', items]">
          <li q-if="true">test</li>
        </ul>
      </div>
    );
  }
}

function test2(){
  Router.map({
    path : "/",
    comps : [
      {
        comp : Sample
      }
    ]
  });
  Router.load();
}

function test1(){
  /*
    comment block;

    current problems:
    - not escaping \< \> properly (using both)
  */
  console.log("ready");
  var name = "john";
  var age= 12;
  var month = "August 21st";
  let a = (
    #<div id="m\"id"
    class="sss">
      before
      <div>
        My name is {name} and <br>my shoe size is {age}
        but I am {(age+age)} <span id="month"> after {month}</span>
      </div>
      //ignore me
      /*and me*/
      ---
      <div
      >{name}</div><span> after name </span>
      <div class="is-{name.toUpperCase()}" id="test">{"is ",test(name)}</div>
       after
    </div>
  );
  return a;
  let dom  = Quas.createElement(a);
  document.querySelector("#app").append(dom);
}
