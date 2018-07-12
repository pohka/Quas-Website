import "/quas/css/animation.css"

export({
  play(comp, animName){
    //set the style of the animation
    let anim = comp.anim[animName];
    let style = "animation:" + anim.type + " " + anim.duration + "s " + anim.effect + ";";
    comp.dom.setAttribute("style", style);

    //remove once the animation is finished
    setTimeout(()=>{
      comp.dom.setAttribute("style", "");
    }, anim.duration * 1000);
  }
});
