

function ready(){
  /*
    comment block;
  */
  console.log("ready");
  let a = (
    #<div id="myid" class="sss">test
      <span>aa aa </span>after
    </div>
  );
  let dom  = Quas.createDOM(a);
  document.querySelector("#app").append(dom);
}
