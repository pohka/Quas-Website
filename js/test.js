import Quas.Router

function test(name){
  let bracket = "</>";
  //return #<span>{name} from here? \>{bracket}</span>;

  //return(
  let svg =  (
    #<svg aria-hidden="true" data-prefix="far" data-icon="thumbs-up" role="img" viewBox="0 0 512 512">
      <path fill="black" d="M466.27 286.69C475.04 271.84 480 256 480 236.85c0-44.015-37.218-85.58-85.82-85.58H357.7c4.92-12.81 8.85-28.13 8.85-46.54C366.55 31.936 328.86 0 271.28 0c-61.607 0-58.093 94.933-71.76 108.6-22.747 22.747-49.615 66.447-68.76 83.4H32c-17.673 0-32 14.327-32 32v240c0 17.673 14.327 32 32 32h64c14.893 0 27.408-10.174 30.978-23.95 44.509 1.001 75.06 39.94 177.802 39.94 7.22 0 15.22.01 22.22.01 77.117 0 111.986-39.423 112.94-95.33 13.319-18.425 20.299-43.122 17.34-66.99 9.854-18.452 13.664-40.343 8.99-62.99zm-61.75 53.83c12.56 21.13 1.26 49.41-13.94 57.57 7.7 48.78-17.608 65.9-53.12 65.9h-37.82c-71.639 0-118.029-37.82-171.64-37.82V240h10.92c28.36 0 67.98-70.89 94.54-97.46 28.36-28.36 18.91-75.63 37.82-94.54 47.27 0 47.27 32.98 47.27 56.73 0 39.17-28.36 56.72-28.36 94.54h103.99c21.11 0 37.73 18.91 37.82 37.82.09 18.9-12.82 37.81-22.27 37.81 13.489 14.555 16.371 45.236-5.21 65.62zM88 432c0 13.255-10.745 24-24 24s-24-10.745-24-24 10.745-24 24-24 24 10.745 24 24z"></path>
    </svg>
  );

  return #<div q-append="svg"></div>;

    /*
    var svgNS = "http://www.w3.org/2000/svg";

    function createCircle()
    {
        var myCircle = document.createElementNS(svgNS,"circle"); //to create a circle. for rectangle use "rectangle"
      //  myCircle.setAttributeNS(null,"id","mycircle");
        myCircle.setAttributeNS(null,"cx",100);
        myCircle.setAttributeNS(null,"cy",100);
        myCircle.setAttributeNS(null,"r",50);
      //  myCircle.setAttributeNS(null,"fill","black");
      //  myCircle.setAttributeNS(null,"stroke","none");
        return myCircle;
    }

    let app = document.getElementById("app");
    let svg = document.createElementNS(svgNS,"svg");
    let circle = createCircle();
    svg.appendChild(circle);
    app.appendChild(svg)

    */
//  );
}

function test3(){
  let esc = new Escape({ text : '" close' });
  Quas.render(esc, "#app");
}

class Escape extends Component{
  render(){
    return test();
    //return #<div>{"hijack(",this.props.text, ");>"} \>\>\>after</div>;
  }
}

function hijack(){
  console.log("hijacked");
}

function ready(){
  test3();
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
