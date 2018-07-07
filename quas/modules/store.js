
Quas.export({
  init : () => {
    Store.data = {};
    Store.state = {};
    Store.observers = {};
    Store.observerCount = 0;

    Component.prototype.observe = function(state){
      this.observerID = Store.observerCount;
      Store.observerCount++;
      if(!Store.observers[state]){
        Store.observers[state] = [];
      }
      Store.observers[state].push(this);
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
  }
});
