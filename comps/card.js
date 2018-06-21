import importme from "/js/importme.js";

Quas.export(
  class Card extends Component{
    constructor(img, title, text){
      super();
      this.img = img;
      this.title = title;
      this.text = text;
      importme.me();
    }

    render(){
      return (
        <quas>
          <div class="card">
            <img src="/img/{this.img}">
            <h3>{this.title}</h3>
            <span>{this.text}</span>
          </div>
        </quas>
      );
    }
});
