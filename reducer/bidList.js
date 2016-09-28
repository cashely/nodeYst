var ObjectAssign = require('object-assign');
import {LOADBIFLISTCONTENTDATA,SHOWFILTERBIDLIST,UNSHOWFILTERPBIDLIST,INFINITE,UNINFINITE,CHANGEBIDLISTTITLEORREPORTKEY,CHANGEBIDLISTFILTER} from '../components/config/variable';
// 药品详情信息
var defaultBidList={
  data:[],
  isShowFilter:false,
  produceType:null,
  infinite:false,
  pageNo:1,
  municipality:1,
  searchName:null,
  getBidAreaInfo:[],
  getProjectStatus:[],
  searchProductStatus:0,
  sord:null
}
export default function bidList(state=defaultBidList,action){
  switch(action.type){
    case "getBidAreaInfo" : return ObjectAssign({},state,{getBidAreaInfo:action.getBidAreaInfo});
    case "getProjectStatus" : return ObjectAssign({},state,{getProjectStatus:action.getProjectStatus});
    case INFINITE : return ObjectAssign({},state,{infinite:false});
    case UNINFINITE : return ObjectAssign({},state,{infinite:true});
    case LOADBIFLISTCONTENTDATA : return ObjectAssign({},state,{data:action.data,pageNo:action.pageNo});
    case SHOWFILTERBIDLIST : return ObjectAssign({},state,{isShowFilter:true});
    case UNSHOWFILTERPBIDLIST : return ObjectAssign({},state,{isShowFilter:false});
    case CHANGEBIDLISTTITLEORREPORTKEY : return ObjectAssign({},state,{searchName:action.searchName});
    case CHANGEBIDLISTFILTER : return ObjectAssign({},state,{areaName:action.areaName,areaId:action.areaId,searchAreaType:action.searchAreaType,yearMonth:action.yearMonth,searchProductStatus:action.searchProductStatus,sord:action.sord});
    default : return state;
  }
}