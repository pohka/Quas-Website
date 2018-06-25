# Components
Making your own component is as simple as making a new class which extends Component and giving it a render function. The render function should contain quas tags. The quas tags should be on seperate lines and everything between the opening and closing quas tag will use a html like syntax.

```js
class MyFirstComponent extends Component{
	render(){
		<quas>
			<div>Hello World</div>
		</quas>
	}
}

// starting point
function ready(){
	let myComponent = new MyFirstComponent();
	Quas.render(myComponent, '#app'); //render to the body tag
}
```

## Rendering
There is a few different ways you can render a component. The default way as shown above will append the content of the component as a child of the parent chosen using the query selector. The query selector works the same as JavaScript's document.querySelector( ) e.g. '#id' and '.class'.

```js
Quas.render(myComponent, '#myID');
```
