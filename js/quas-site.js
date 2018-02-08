console.log("hello world");

function start(){
  let nav = new Navbar([
    {text : "item 1", action:"test"}
  ]);
  let body = document.getElementsByTagName("BODY")[0];
  Quas.render(nav, body);
}
