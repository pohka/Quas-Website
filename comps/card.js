import "/comps/card.css";

Quas.export(
  class Card extends Component{
    constructor(props){
      super(props);
      this.pure = true;
    }

    render(){
      return (
          #<div class="card">
            <img src="/img/{this.props.img}">
            <h3>{this.props.title}</h3>
            <span>{this.props.text}</span>
          </div>
      );
    }
});
