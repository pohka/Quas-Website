

function ready(){
  /*
    comment block;
  */
  console.log("ready");
  var name = "john";
  let a = (
    #<div id="myid" class="sss">
      <div class="myrealllllllllllly long xcklass name is here"
      id="test">
        name: {name} doe
      </div> after
    </div>
  );
  console.log(a);
  let dom  = Quas.createDOM(a);
  document.querySelector("#app").append(dom);
}
