

function ready(){
  /*
    comment block;
  */
  console.log("ready");
  let a = (
    #<div id="myid" class="sss">
      abc
      <div class="myrealllllllllllly long xcklass name is here"
        id="test">
          123
      </div>
      after
    </div>
  );
  console.log(a);
  let dom  = Quas.createDOM(a);
  document.querySelector("#app").append(dom);
}
