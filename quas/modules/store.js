
Quas.export({
  init : () => {
    Store.data = {};
    Store.state = {};
    Store.observers = {};
    Store.observerCount = 0;
    Quas.addListener(Store, "unmount");

    Component.prototype.observe = function(state){
      this.observerID = Store.observerCount;
      Store.observerCount++;
      if(!Store.observers[state]){
        Store.observers[state] = [this];
      }
      else{
        Store.observers[state].push(this);
      }
    }
  },

  getData : (key) =>{
    return Store.data[key];
  },

  setData : (key, val) => {
    Store.data[key] = val;
  },

  getState : (key) => {
    return Store.state[key];
  },

  setState : (key, val) => {
    Store.state[key] = val;
    for(let i in Store.observers[key]){
      Quas.render(Store.observers[key][i]);
    }
  },

  onEvent : (eventName, comp) => {
    if(comp.observerID === undefined || eventName != "unmount") return;

    for(let state in Store.observers){
      for(let i=0; i<Store.observers[state].length; i++){
        if(comp.observerID == Store.observers[state][i].observerID){
          Store.observers[state].splice(i,1);
          i-=1;
        }
      }
    }
  }
});
