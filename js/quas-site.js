function start(){
  let nav = new Navbar([
    {text : "Docs", action:"/docs"},
    {text : "Examples", action:"/"},
  ]);
  Quas.renderRule(nav, "body", "prepend");
  let card1 = new Card("/img/code.png", "Super Fast", "Some text");
  Quas.render(card1, "#card-row-1");
  let card2 = new Card("/img/code.png", "Easy to learn", "keepo");
  Quas.render(card2, "#card-row-1");
  let card3 = new Card("/img/code.png", "Totally Original", "Definately not the poor mans versin of react");
  Quas.render(card3, "#card-row-1");
  let card4 = new Card("/img/code.png", "I dont even know", "what to put here");
  Quas.render(card4, "#card-row-2");
  Quas.render(card4, "#card-row-2");
  //Quas.remove(nav);
}
