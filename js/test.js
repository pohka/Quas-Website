import Quas.Router

function test(size){
  let bracket = "</>";
  //return #<span>{name} from here? \>{bracket}</span>;

  //return(
  let svg =  (
    #<svg aria-hidden="true" data-prefix="far" data-icon="thumbs-up" role="img" viewBox="0 0 512 512">
      <circle cx="{size}" cy="{size}" r="{size}"></circle>
    </svg>
  );

  if(size < 30){
    return svg;
  }
  else return (
    #<svg aria-hidden="true" data-prefix="far" data-icon="thumbs-up" role="img" viewBox="0 0 512 512">
      <circle fill="red" cx="{size}" cy="{size}" r="{size}"></circle>
    </svg>
  )
}

class Escape extends Component{
  constructor(props){
    super(props);
    this.initStates({
      size : 20
    });
  }

  render(){
    console.log("rendering");
    //return #<div q-append="test(this.state.size)"></div>
    return test(this.state.size);
    //return #<div>{"hijack(",this.props.text, ");>"} \>\>\>after</div>;
  }
}
var esc = new Escape({ text : '" close'});


function test3(){
  Quas.render(esc, "#app");
}



function hijack(){
  console.log("hijacked");
}

function ready(){
  Quas.render(esc, "#app");
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
