import React,{Component} from 'react';
import NormalHeaderBar from './../common/normalHeaderBar';
export default class FilterProduce extends Component{
  constructor(props) {
    super(props);
    this.state = {
      searchAreaType:this.props.dataSources.searchAreaType,
      reportType:this.props.dataSources.reportType,
      searchType:this.props.dataSources.searchType,
      active:this.props.dataSources.active,
      sord:this.props.dataSources.sord,
      sidx:this.props.dataSources.sidx,
      costStatus:this.props.dataSources.costStatus,
      dataSourcesTag:this.props.dataSources.reportTag
    };
  }
  _cancelButton(){
    this.props.dispatch({
      type:'UNSHOWFILTERPRODUCE'
    });
  }
  _sureButton(){
    console.log(this.state.reportTag);
    this.props.fn(this.state);
  }
  render(){
    console.log(this.state.active,"active");
    return(
      <div className="modal-backdrop">
        <div className="modal-backdrop-bg"></div>
        <div className="modal">
          <NormalHeaderBar cancelButton={this._cancelButton.bind(this)} sureButton={this._sureButton.bind(this)} title="请选择"/>
          <div className="scroll-content has-header" style={{backgroundColor:'#fff'}}>
            <h2 className="item item-divider">报告种类</h2>
            <div className="list padding">
              <ul className="list-horizontal-block">
                {
                  this.props.dataSources.ReportTypeDate.map((ele,index)=>{
                    return(
                        <li key={index} style={(this.state.reportType == ele.id) ? styles.active : null} onClick={()=>{this.setState({reportType:ele.id})}}>{ele.typeName}</li>
                    )
                  })
                }
              </ul>
            </div>
            <h2 className="item item-divider">报告类型</h2>
            <div className="list padding">
              <ul className="list-horizontal-block">
                <li style={(this.state.searchType == 1) ? styles.active : null} onClick={()=>{this.setState({searchType:1,reportTag:true})}}>全部</li>
                <li style={(this.state.searchType == 0) ? styles.active : null} onClick={()=>{this.setState({searchType:0,reportTag:false})}}>最新报告</li>
                <li style={(this.state.searchType == 2) ? styles.active : null} onClick={()=>{this.setState({searchType:2,reportTag:false})}}>热门报告</li>
              </ul>
            </div>
            <h2 className="item item-divider">排序</h2>
            <div className="list padding">
              <ul className="list-horizontal-block">
                <li style={(this.state.active == 0) ? styles.active : null} onClick={()=>{this.setState({sord:"desc",sidx:"publishDate",active:0})}}>最新时间</li>
                <li style={(this.state.active == 1) ? styles.active : null} onClick={()=>{this.setState({sord:"asc",sidx:"price",active:1})}}>最低价格</li>
                <li style={(this.state.active == 2 ) ? styles.active : null} onClick={()=>{this.setState({sord:"desc",sidx:"price",active:2})}}>最高价格</li>
              </ul>
            </div>
            <h2 className="item item-divider">费用类型</h2>
            <div className="list padding">
              <ul className="list-horizontal-block">
                <li style={(this.state.costStatus == null) ? styles.active : null} onClick={()=>{this.setState({costStatus:null})}}>全部</li>
                <li style={(this.state.costStatus == 0) ? styles.active : null} onClick={()=>{this.setState({costStatus:0})}}>免费报告</li>
                <li style={(this.state.costStatus == 1) ? styles.active : null} onClick={()=>{this.setState({costStatus:1})}}>收费报告</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const styles = {
  active:{
    backgroundColor:'#0284D0',
    color:'#fff'
  },
  fTitle:{
    color:'#000',
    fontWeight:'bold'
  }
}