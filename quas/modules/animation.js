import "/quas/css/animation.css"

export({
  play(comp, animName){
    //set the style of the animation

    //animation: type duration timing delay iterations direction;
    let anim = comp.anims[animName];
    let delay = 0;
    let style = "animation:" + anim.type + " " + anim.duration + "s";
    if(anim.timing !== undefined){
      style += " " + anim.timing;
    }
    if(anim.delay !== undefined){
      delay = anim.delay;
    }
    // animation out
    if(anim.out){
      style += " reverse";
      if(anim.useFade){
        style += ",fadeOut " + anim.duration + "s";
      }
    }
    //animation in
    else{
      if(anim.useFade){
        style += ",fadeIn " + anim.duration + "s";
      }
    }

    style += ";";



    //remove once the animation is finished
    setTimeout(function(){
      comp.dom.setAttribute("style", style);
      setTimeout(function(){
        if(comp.dom){
          comp.dom.setAttribute("style", "");
        }
      }, anim.duration * 1000);
    }, delay*1000);
  },

  build(name, direction, useFade, isEnter){

  }
});
