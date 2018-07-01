function test(name){
  return ["span", {}, [name + "1234"]];
}

function ready(){
  /*
    comment block;
  */
  console.log("ready");
  var name = "john";
  var age= 12;
  let a = (
    #<div id="myid" class="sss">
      <div class="is{age}"id="test">{name}<br>age: {age}</div>
       after
    </div>
  );
  console.log(a);
  let dom  = Quas.createDOM(a);
  document.querySelector("#app").append(dom);
}
