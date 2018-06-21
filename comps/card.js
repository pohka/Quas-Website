import importme from "/js/importme.js";
import "/comps/card.css";

Quas.export(
  class Card extends Component{
    constructor(img, title, text){
      super();
      this.img = img;
      this.title = title;
      this.text = text;
      importme.me();
    }

    static init(key){
      this.id =  "123";
    }

    render(){
      let code1 = "let a = '123';";
      return (
        <quas>
          <div class="card">
            <img src="/img/{this.img}">
            <h3>{this.title}</h3>
            <span>{this.text}</span>
            <pre>
              <code q-code="{code1}"></code>
            </pre>
          </div>
        </quas>
      );
    }
});
