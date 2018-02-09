function start(){
  let nav = new Navbar([
    {text : "Docs", action:"/docs"},
    {text : "Examples", action:"/"},
  ]);
  Quas.render(nav, "body");
  //Quas.remove(nav);
}
