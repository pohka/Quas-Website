function test(name){
  return #<span>{name} from here? \>\></span>
  ;
}

function ready(){
  /*
    comment block;

    current problems:
    - not escaping \< \> properly (using both)
    - not including text after root closing tag
  */
  console.log("ready");
  var name = "john";
  var age= 12;
  var month = "August 21st";
  let a = (
    #<div id="myid" class="sss">
      before
      <div>
        My name is {name} and <br>my shoe size is {age}
        but I am {(age+age)} <span> after {month}</span>
      </div>
      //ignore me
      /*and me*/---
      <div>{name}</div>
      <div class="is-{name.toUpperCase()}"id="test">{"is ",test(name)}</div>
       after
    </div>
  );
  console.log(a);
  let dom  = Quas.createDOM(a);
  document.querySelector("#app").append(dom);
}
