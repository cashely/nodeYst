/*
 报告列表
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import FooterBar from './footerBar';
import {Link} from 'react-router';
import FilterReport from './filterReport';
import Loading from './loading';
import EmptyComponent from './emptyComponent';
import {loadNewrepor,loadPicture,insertUserAction,getReportType,loadReportList} from './function/ajax';

class Report extends Component {
  constructor(props){
    super(props);
    console.log(this.props.params.id)
    this.state={
      searchType:this.props.report.searchType,
      loading:true,
      request:true
    };
    this._loadData = this._loadData.bind(this);
    this._infiniteScroll = this._infiniteScroll.bind(this);
  }
  _loadData(){
    this.setState({
      request:false
    });
    loadReportList({
      titleOrReportKey:this.props.report.titleOrReportKey,
      pageNo:this.props.report.pageNo,
      searchType:this.props.report.searchType,
      reportType:this.props.report.reportType,
      callBack:(res)=>{
        this.props.dispatch({
          type:'LOADPRODUCEDATA',
          data:this.props.report.data.concat(res.datas),
          pageNo:this.props.report.pageNo+1
        });
        if(res.totalSize <= this.props.report.data.length){
          this.props.dispatch({
            type:'UNINFINITE'
          });
        }else{
          this.props.dispatch({
            type:'INFINITE'
          });
        }
        this.setState({
          loading:false
        });
        this.setState({
          request:true
        });
      }
    });
  }
  _infiniteScroll(){
    //全部高度-滚动高度 == 屏幕高度-顶部偏移
    if(this.ele.firstChild.clientHeight-this.ele.scrollTop <= document.body.clientHeight-this.ele.offsetTop && !this.props.report.infinite && this.state.request){
      console.log("sdddd",this.props.report.infinite)
      this._loadData();
    }
  }
  _getReportType(){
    getReportType({
      callBack:(res)=>{
        this.props.dispatch({
          type:'CHANGEREPORTTYPE',
          ReportTypeDate:res.datas,
        });
      }
    });
  }
  componentDidMount(){
    this.ele = this.refs.content;
    console.log(this.refs.content);
    this.ele.addEventListener('scroll',this._infiniteScroll);
    console.log(this.state.searchType);
    this._loadData();
    this._getReportType();
  }
  componentWillUnmount(){
    this.props.dispatch({
      type:'UNSHOWFILTERPRODUCE',
    });
      this.props.dispatch({
        type:'LOADPRODUCEDATA',
        data:[],
        pageNo:1
      });
  }
  _fn(args) {
    this.setState({
      loading:true
    });
    this.props.dispatch({
      type:'LOADPRODUCEDATA',
      data:[],
      pageNo:1
    });
    this.props.dispatch({
      type:'UNSHOWFILTERPRODUCE'
    })
    this.props.dispatch({
      type:'CHANGETYPE',
      searchType:args.searchType,
      reportType:encodeURI(encodeURI(args.reportType))
    });
    setTimeout(()=>{
      this._loadData();
    },100);
  }
  _searchHandle(){
    this.setState({
      loading:true
    });
    this.props.dispatch({
      type:'LOADPRODUCEDATA',
      data:[],
      pageNo:1,
    });
    setTimeout(()=> this._loadData(),100);
  }
  render() {
    return (
      <div className="root">
        <HeaderBar {...this.props} searchHandle={this._searchHandle.bind(this)}/>
        <div  ref="content"  className="scroll-content has-header report-view">
          <Main data={this.props.report.data} loading={this.state.loading}/>
        </div>
        <FooterBar {...this.props}/>
        {
          this.props.report.isShowFilter ?
            <FilterReport fn={this._fn.bind(this)}  {...this.props} dataSources={this.props.provicenData}/> : null
        }
      </div>
    )
  }
}
class HeaderBar extends Component{
  _showProvicenHandle(){
    this.props.dispatch({
      type:'SHOWFILTERPRODUCE'
    });
  }
  _changeHandle(){
    this.props.dispatch({
      type:'CHANGETITLEORREPORTKEY',
      titleOrReportKey:encodeURI(encodeURI(this.refs.hospitalSearchName.value))
    })
  }
  render(){
    return(
      <div className="bar bar-header bar-positive item-input-inset">
        <div className="buttons">
          <button className="button" onClick={this._showProvicenHandle.bind(this)}>
            <i className="fa fa-th-large  fa-2x" aria-hidden="true" style={{display:"block"}}></i>
          </button>
        </div>
        <label className="item-input-wrapper">
          <i className="icon ion-ios-search placeholder-icon"></i>
          <input ref="hospitalSearchName" onChange={this._changeHandle.bind(this)} type="search" placeholder="请输入搜索关键词"/>
        </label>
        <button className="button button-clear" onClick={this.props.searchHandle}>
           搜索
        </button>
      </div>
    )
  }
}
class Main extends Component{
  constructor(props){
    super(props);
  }
  render(){
    if(this.props.loading) {
      return <Loading/>
    }else{
      if(this.props.data.length != 0){
        return(
            <ul className="report-cards row">
              {
                this.props.data.map((ele,index)=> <List dataSources={ele} key={ele.id}/>)
              }
            </ul>
        )
      }else{
        return <EmptyComponent/>
      }
    }
  }
}
class List extends Component{
  constructor(props){
    super(props);
    };
  insertUserAction(e){
    insertUserAction({
      reportId:this.props.dataSources.id,
      costStatus:this.props.dataSources.costStatus,
      callBack:(res)=> {
        console.log(res)
      }
    });

  }
  render(){
    var string = null;
    var tag = (()=>{
      if(this.props.dataSources.costStatus == "1"){
        string = <i className="report-card-icon">报告试读</i>;
      }else{
        string = <i className="report-card-icon">点击查看</i>;
      }
      return string;
    })();
    var number = (()=>{
      if(this.props.dataSources.costStatus == "1"){
        string = <span style={{textAlign:"left"}}>{this.props.dataSources.number}人购买</span>;
      }else{
        string = <span style={{textAlign:"left"}}>{this.props.dataSources.number}人查看</span>;
      }
      return string;
    })();
    if(this.props.dataSources.costStatus == "1"){
      this.state= {
        price: this.props.dataSources.price
      }
    }else{
      this.state= {
        price: 0
      }
    }
    return(
        <div className="col-50">
          <Link onClick={this.insertUserAction.bind(this)} to={`/pdf/${this.props.dataSources.id}/${this.props.dataSources.title}`}>
            <div className="report-img">
              <img src={this.props.dataSources.mainImg}/>
            </div>
            <h3> {this.props.dataSources.title}</h3>
            <div className="report-card-price">¥{this.state.price}</div>
            <p className="report-card-footer">
              {number}
              {tag}
            </p>
          </Link>
        </div>
    )
  }
}
function select(state){
  return{
    subscribe:state.report.subscribe,
    subscribeTwo:state.report.subscribeTwo,
    showProvicen:state.index.showProvicen,
    areaId:state.provicen.areaId,
    areaName:state.provicen.areaName,
    provicenData:state.provicen.data,
    yearMonth:state.data.yearMonth,
    uri:state.router.uri,
    report:state.report,
    searchAreaType:state.provicen.searchAreaType
  }
}

export default connect(select)(Report);