
Quas.export(
  class SharedStore{


    static init(){
      this.data = {};
      this.state = {};
      this.observers = {};
      this.observerCount = 0;
    }

    static getData(key){
      return SharedStore.data[key];
    }

    static setData(key, val){
      SharedStore.data[key] = val;
    }

    static getState(key){
      return SharedStore.state[key];
    }

    static setState(key, val){
      SharedStore.state[key] = val;
      for(let i in this.observers[key]){
        Quas.render(this.observers[key][i]);
      }
    }

    static observe(comp, state){
      comp.observerID = SharedStore.observerCount;
      SharedStore.observerCount++;
      if(!SharedStore.observers[state]){
        SharedStore.observers[state] = [];
      }
      SharedStore.observers[state].push(comp);
    }
  }
);
