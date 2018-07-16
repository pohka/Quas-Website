---
export(
  class DownloadBody extends Component{
    render(){
      if(DownloadBody.renderedOnce === undefined){
          DownloadBody.renderedOnce = 0;
      }
      else{
        DownloadBody.renderedOnce++;
      }
      if(DownloadBody.renderedOnce%2 == 0){
        this.state.show = true;
        return #<div>download</div>
      }
      else{
        this.state.show = true;
        return "";
      }
    }
  }
);
