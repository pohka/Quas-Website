
Quas.export({
  //scrolls to the element with a matching id to the url hash
  toHash : (offset) =>{
    let hash = window.location.hash;
    if(hash){
      let el = document.querySelector(hash);
      if(el != null){
        let y = el.offsetTop;
        if(offset){
          y -= offset;
        }
        window.scrollTo(0, y);
      }
    }
  }
});
