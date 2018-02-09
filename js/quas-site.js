function start(){
  let nav = new Navbar([
    {text : "item 1", action:"test"},
    {text : "item 2", action:"test"},
  ]);
  Quas.render(nav, "body");
  //Quas.remove(nav);
}
