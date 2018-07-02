function test(name){
  let bracket = "<>";
  return #<span>{name} from here? \>{bracket}</span>;
}

function ready(){
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
        but I am {(age+age)} <span> after {month}</span>
      </div>
      //ignore me
      /*and me*/---
      <div
      >{name}</div><span> after name </span>
      <div class="is-{name.toUpperCase()}" id="test">{"is ",test(name)}</div>
       after
    </div>
  );
  console.log(a);
  let dom  = Quas.createDOM(a);
  document.querySelector("#app").append(dom);
}
