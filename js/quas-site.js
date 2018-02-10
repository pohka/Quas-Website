function startQuas(){
  let nav = new Navbar([
    {text : "Docs", action:"/docs"},
    {text : "Examples", action:"/"},
  ]);
  Quas.renderRule(nav, "body", "prepend");

  let card1 = new Card("/img/small-rocket-ship-silhouette.png", "Super Fast", "Some text");
  Quas.render(card1, "#card-row-1");

  let card2 = new Card("/img/lightning-bolt-shadow.png", "Lightweight", "Less than 3KB with gzip");
  Quas.render(card2, "#card-row-1");

  let card3 = new Card("/img/couple-of-arrows-changing-places.png", "Modular Components", "Definately not the poor mans versin of react");
  Quas.render(card3, "#card-row-1");

  let card4 = new Card("/img/code.png", "Custom HTML Attributes", "what to put here");
  Quas.render(card4, "#card-row-2");

  let card5 = new Card("/img/desktop-monitor.png", "Breakpoints", "what to put here");
  Quas.render(card5, "#card-row-2");

  let card6 = new Card("/img/refresh-page-option.png", "Cookies", "what to put here");

  Quas.render(card6, "#card-row-2");
  card6.setProp("title", "hello");
  card6.remove();
}
