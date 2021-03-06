import $ from 'jquery';
import {httpAddress,WXKEY} from '../config.js';
import {encode,url2obj} from './common';
import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import ystReducers from '../../reducer/reducer.js';
export var store = createStore(ystReducers,applyMiddleware(thunk));

//请求队列
var ajaxQueues = [],isGetUsering = false;

//首页数据加载
export const loadIndex = function(dispatch,args){

    var params ={
        yearMonth:args.yearMonth,
        areaId:args.areaId,
        searchAreaType:args.searchAreaType,
        isOther:args.isOther,
        callBack:args.callBack || function(){}
    }
    ajaxFn({
        url:'business/getMarketInfo',
        data:{
            yearMonth:params.yearMonth,
            areaId:params.areaId,
            isOther:params.isOther,
            searchAreaType:params.searchAreaType
        },
        callBack:(res)=>{
            if(res.state == 1){
                params.callBack(res);
            }else{
                alert(res.message)
            }
        }
    })
}
//省份加载
export const loadProvince = function(dispatch){
    ajaxFn({
        url:'business/getProvinceAreaAllInfo',
        callBack:(res)=>{
            dispatch({
                type:'LOADPROVICEN',
                data:res.datas
            });
        }
    })
}

//行情首页省份列表省份加载
export const getFirstPageProlist = function(dispatch){
    ajaxFn({
        url:'business/getFirstPageProlist',
        callBack:(res)=>{
            dispatch({
                type:'CHANGEMARKETPROVICEN',
                data:res.datas
            });
        }
    })
}

//分类涨幅榜品种详情
export const loadSingleClassifyProduct = function(dispatch,args){
    ajaxFn({
        url:'business/getSalesBreedInfo',
        data:{
            yearMonth:args.yearMonth || "",
            areaId:args.areaId || "",
            salesId:args.salesId || "",
            pageNo:args.pageNo || 1,
            searchAreaType:args.searchAreaType || "",
            searchName:args.searchName || "",
            sord:args.sord || "",
            sidx:args.sidx || "",
            pageSize:15,
        },
        callBack:(res)=>{
            args.callBack(res)
        }
    })
}

//分类涨幅榜品种列表
export const loadListClassifyProduct = function(dispatch,args){
    ajaxFn({
        url:'business/getBusinessSalesInfo',
        data:{
            yearMonth:args.yearMonth || "",
            areaId:args.areaId || "",
            searchAreaType:args.searchAreaType || "",
            pageNo:args.pageNo || 1,
            sord:args.sord || "",
            sidx:args.sidx || "",
            pageSize:15,
        },
        callBack:(res)=>{
            args.callBack(res)
        }
    })
}
//概念涨幅榜品种详情
export const loadSingleConceptProduct = function(dispatch,args){
    ajaxFn({
        url:'business/getConceptBreedInfo',
        data:{
            yearMonth:args.yearMonth || "",
            areaId:args.areaId || "",
            conceptId:args.conceptId || "",
            searchAreaType:args.searchAreaType || ""
        },
        callBack:(res)=>{
            args.callBack(res)
        }
    })
}
//概念涨幅榜品种列表
export const loadListConceptProduct = function(dispatch,args){
    ajaxFn({
        url:'business/getBusinessConceptInfo',
        data:{
            yearMonth:args.yearMonth || "",
            areaId:args.areaId || "",
            searchAreaType:args.searchAreaType || "",
            pageNo:args.pageNo || 1
        },
        callBack:(res)=>{
            args.callBack(res)
        }
    })
}
//影响力排行榜列表
export const loadListBreedProduct = function(dispatch,args){
    ajaxFn({
        url:'business/getBusinessBreedByUpInfo',
        data:{
            yearMonth:args.yearMonth || "",
            areaId:args.areaId || "",
            searchAreaType:args.searchAreaType || "",
            pageNo:args.pageNo || 1,
            sord:args.sord || "",
            sidx:args.sidx || "",
            searchName:args.searchName || "",
            pageSize:15,
        },
        callBack:(res)=>{
            args.callBack(res)
        }
    })
}

//JS-SDK授权
export const loadJssdk = function(args){
    ajaxFn({
        url:'business/getJsSdkInfo',
        data:{
            strBackUrl:encodeURI(encodeURI(args.uri))
        },
        callBack:(res)=>{
            args.callBack(res)
        }
    })
}

//初始化用户
export const loadWx = function(args){
    ajaxFn({
        url:'business/getInitWxUser',
        data:{
            code:args.code,
            recommender:args.recommender
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//获取用户信息
export const loadUserInfo = function(args){
    ajaxFn({
        url:'business/getWxUserInfo',
        data:{
            userId:args.userId
        },
        callBack:(res) =>{
            args.callBack(res);
        }
    })
}
//获取用户信息
export const getInitWxUser = function(args){
    ajaxFn({
        url:'business/getInitWxUser',
        data:{
            userId:args.userId
        },
        callBack:(res) =>{
            args.callBack(res);
        }
    })
}
//获取用户反馈列表
export const getBusinessFeedBackInfo = function(args){
    ajaxFn({
        url:'business/getBusinessFeedBackInfo',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//发送反馈建议
export const insertBusinessFeedBackInfo = function(args){
    ajaxFn({
        url:'business/insertBusinessFeedBackInfo',
        data:{
            feedContent:args.feedContent
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//获取地理位置信息
export const getUserAreaInfo = function(args){
    ajaxFn({
        url:'business/getUserAreaInfo',
        data:{
            latitude:args.latitude,
            longitude:args.longitude
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//首页数据加载
export const loadNewrepor = function(args){
    ajaxFn({
        url:'business/firstPage',
        data:{
            searchName:args.searchName || "",
            yearMonth:args.yearMonth || "",
            areaId:args.areaId || "",
            pageNo:args.pageNo || "",
            hosLevel:args.hospitalLevel || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//获取最新更新内容
export const getNewContent = function(args){
    ajaxFn({
        url:'business/getNewContent',
        data:{
            publishDate:args.publishDate || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//图片
export const loadPicture = function(args){
    ajaxFn({
        url:'advertisement/getPicture',
        data:{
            searchName:args.searchName || "",
            yearMonth:args.yearMonth || "",
            areaId:args.areaId || "",
            imgType:args.imgType || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//专栏订阅列表
export const getCiReportColumnList = function(args){
    ajaxFn({
        url:'business/getCiReportColumnList',
        data:{
            titleOrReportKey:args.titleOrReportKey|| "",
            pageNo:args.pageNo || "",
            pageSize:args.pageSize || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//专栏订阅分类列表
export const getReportColumnTypeList = function(args){
    ajaxFn({
        url:'business/getReportColumnTypeList',
        data:{
            columnId:args.columnId|| "",
            titleOrReportKey:args.titleOrReportKey|| "",
            pageNo:args.pageNo || "",
            pageSize:args.pageSize || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//专栏订阅详情
export const getColumnReportList = function(args){
    ajaxFn({
        url:'business/getColumnReportList',
        data:{
            columnId:args.columnId|| "",
            pageNo:args.pageNo || "",
            reportType:args.reportType || "",
            pageSize:args.pageSize || "",
            costStatus:args.costStatus || "",
            titleOrReportKey:args.titleOrReportKey|| ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//课程点赞
export const insertLikeReport = function(args){
    ajaxFn({
        url:'business/insertLikeReport',
        data:{
            reportId:args.reportId|| ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//报告列表数据加载
export const loadReportList = function(args){
    ajaxFn({
        url:'business/getLastHotReport',
        data:{
            reportType:args.reportType || "",
            pageNo:args.pageNo || "",
            searchType:args.searchType || "",
            titleOrReportKey:args.titleOrReportKey,
            sidx:args.sidx ,
            sord:args.sord ,
            areaId:args.areaId || "",
            costStatus:args.costStatus,
            pageSize:args.pageSize || "",
            columnId:args.columnId || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//获取评论详情
export const selectReportReplys = function(args){
    ajaxFn({
        url:'business/selectReportReplys',
        data:{
            pageNo:args.pageNo||"",
            reportId:args.reportId||"",
            columnId:args.columnId||""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

export const selectReportDetail = function(args){
    ajaxFn({
        url:'business/selectReportDetail',
        data:{
            reportId:args.reportId||"",
            columnId:args.columnId||""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//发送评论
export const insertReplyReport = function(args){
    ajaxFn({
        url:'business/insertReplyReport',
        data:{
            reportId:args.reportId||"",
            replyContent:args.replyContent||"",
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//中标数据加载
export const loadBidList = function(args){
    ajaxFn({
        url:'business/getBidList',
        data:{
            searchName:args.searchName || "",
            pageNo:args.pageNo || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//产品接口(产品数据)
export const loadProd = function(args){
    ajaxFn({
        url:'business/getTradeProductList',
        data:{
            searchName:args.searchName || "",
            yearMonth:args.yearMonth || "",
            areaId:args.areaId || "",
            pageNo:args.pageNo || "",
            hosLevel:args.hospitalLevel || "",
            tradeType:args.tradeType,
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//中标详情页数据加载
export const loadBidListContent = function(args){
    ajaxFn({
        url:'business/getBidDetail',
        data:{
            areaId:args.areaId || "",
            sord:args.sord || "",
            sidx:args.sidx || "",
            pageNo:args.pageNo || "",
            searchName:args.searchName || "",
            searchProductStatus:args.searchProductStatus || "",
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//中标数据省份信息加载
export const getBidAreaInfo = function(args){
    ajaxFn({
        url:'business/getBidAreaInfo',
        data:{
            searchName:args.searchName || '',
            pageNo:args.pageNo || '',
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//项目状态
export const getProjectStatus = function(args){
    ajaxFn({
        url:'business/getProjectStatus',
        data:{
            statusType:"REPROT_TYPE"
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//已购报告加载
export const loadProduct = function(args){
    ajaxFn({
        url:'business/getUserBuyReportList',
        data:{
            reportType:args.reportType || "",
            pageNo:args.pageNo || "",
            searchType:args.searchType,
            titleOrReportKey:encodeURI(encodeURI(args.titleOrReportKey))
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//用户点击查看/购买报告
export const insertUserAction = function(args){
    ajaxFn({
        url:'business/insertUserAction',
        data:{
            reportId:args.reportId,
            costStatus:args.costStatus,
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//报告类型
export const getReportType = function(args){
    ajaxFn({
        url:'business/getReportType',
        data:{
            columnId:args.columnId || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//政策准入6大板块加载
export const loadPolicyModules = function(args){
    ajaxFn({
        url:'business/getPolicyAccessList',
        data:{
            areaId:args.areaId,
            searchName:encode(args.searchName) || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//质量层次简版
export const loadQualitySimple = function(args){
    ajaxFn({
        url:'business/getQualityLevelList',
        data:{
            searchName:encode(args.searchName),
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//加载质量层次筛选列表项-质量层次
export const loadQualityFilter = function(args){
    ajaxFn({
        url:'business/getQualityLevelSearchMenu',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//加载质量层次筛选列表项-来源
export const loadQualityFilterForm = function(args){
    ajaxFn({
        url:'business/getQlGradeSearchMenu',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//质量层次全部
export const loadQualityAll = function(args){
    ajaxFn({
        url:'business/getQualityLevelDetail',
        data:{
            searchName:encode(args.searchName),
            qualityLevelType:args.qualityLevelTypeId,
            gradeId:args.gradeId,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//基药简版
export const loadBaseSimple = function(args){
    ajaxFn({
        url:'business/getBasicDrugList',
        data:{
            searchName:encode(args.searchName),
            areaId:args.areaId,
            catalogEditionId:args.catalogEditionId,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//加载基药筛选列表项
export const loadBaseFilter = function(args){
    ajaxFn({
        url:'business/getBasicDrugSearchMenu',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//基药全部
export const loadBaseAll = function(args){
    ajaxFn({
        url:'business/getBasicDrugDetail',
        data:{
            searchName:encode(args.searchName),
            areaId:args.areaId,
            catalogEditionId:args.catalogEditionId,
            gradeId:args.gradeId,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//医保简版
export const loadInsuranceSimple = function(args){
    ajaxFn({
        url:'business/getPqriList',
        data:{
            searchName:encode(args.searchName),
            areaId:args.areaId,
            catalogEditionId:args.catalogEditionId,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//加载医保筛选列表项
export const loadInsuranceFilter = function(args){
    ajaxFn({
        url:'business/getPqriSearchMenu',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//医保全部
export const loadInsuranceAll = function(args){
    ajaxFn({
        url:'business/getPqriDetail',
        data:{
            searchName:encode(args.searchName),
            areaId:args.areaId,
            catalogEditionId:args.catalogEditionId,
            gradeId:args.gradeId,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//辅助用药简版
export const loadAssistSimple = function(args){
    ajaxFn({
        url:'business/getAssistDrugList',
        data:{
            searchName:encode(args.searchName),
            areaId:args.areaId,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//加载辅助用药筛选列表项
export const loadAssistFilter = function(args){
    ajaxFn({
        url:'business/getAssistDrugSearchMenu',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//辅助用药全部
export const loadAssistAll = function(args){
    ajaxFn({
        url:'business/getAssistDrugDetail',
        data:{
            searchName:encode(args.searchName),
            areaId:args.areaId,
            gradeId:args.gradeId,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//低价药简版
export const loadLowPriceSimple = function(args){
    ajaxFn({
        url:'business/getLowPriceDrugList',
        data:{
            searchName:encode(args.searchName),
            areaId:args.areaId,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//加载辅助用药筛选列表项
export const loadLowPriceFilter = function(args){
    ajaxFn({
        url:'business/getLowPriceDrugSearchMenu',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//低价药全部
export const loadLowPriceAll = function(args){
    ajaxFn({
        url:'business/getLowPriceDrugDetail',
        data:{
            searchName:encode(args.searchName),
            areaId:args.areaId,
            gradeId:args.gradeId,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//抗菌药物简版
export const loadAntiSimple = function(args){
    ajaxFn({
        url:'business/getAntibioDrugList',
        data:{
            searchName:encode(args.searchName),
            areaId:args.areaId,
            catalogEditionId:args.catalogEditionId,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//加载抗菌药物筛选列表项
export const loadAntiFilter = function(args){
    ajaxFn({
        url:'business/getAntibioDrugSearchMenu',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//抗菌药物全部
export const loadAntiAll = function(args){
    ajaxFn({
        url:'business/getAntibioDrugDetail',
        data:{
            searchName:encode(args.searchName),
            areaId:args.areaId,
            catalogEditionId:args.catalogEditionId,
            gradeId:args.gradeId,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//请求政策准入数据
export const loadPolicyProvince = function(args){
    ajaxFn({
        url:'business/getProductAreaList',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//政策准入数据按关键词搜索通用名
export const loadPolicySearch = function(args){
    ajaxFn({
        url:'business/getProductGenericName',
        data:{
            searchName:encode(args.searchName)
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//获取金银活动状态
export const loadJoinActivity = function(args){
    ajaxFn({
        url:'partakeActivity/isJoinActivity',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//读取报告更新状态
export const loadRecordContent = function(args){
    ajaxFn({
        url:'partakeRecord/getRecordContent',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//读取报告
export const loadReport = function(args){
    ajaxFn({
        url:'pub/getPubReportHtml',
        data:{
            reportId:args.id
        },
        callBack:(res)=>{
            args.callBack(res)
        }
    })
}

//加载收藏报告
export const getReportKeepList = function(args){
    ajaxFn({
        url:'business/getReportKeepList',
        data:{
            reportType:args.reportType || "",
            pageNo:args.pageNo || "",
            searchType:args.searchType,
            titleOrReportKey:encodeURI(encodeURI(args.titleOrReportKey)),
            sidx:args.sidx ,
            sord:args.sord ,
            costStatus:args.costStatus,
            columnBigType:args.columnBigType
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//收藏报告
export const keepReport = function(args){
    ajaxFn({
        url:'business/keepReport',
        data:{
            reportId:args.reportId
        },
        callBack:(res)=>{
            args.callBack(res)
        }
    })
}

//取消收藏报告
export const cancelKeepReport = function(args){
    ajaxFn({
        url:'business/cancelKeepReport',
        data:{
            reportId:args.reportId
        },
        callBack:(res)=>{
            args.callBack(res)
        }
    })
}

   //中标详情页数据加载
export const getAllBidList = function(args){
    ajaxFn({
        url:'business/getAllBidList',
        data:{
            codeProId:args.codeProId || '',
            areaId:args.areaId || '',
            sord:args.sord || '',
            sidx:args.sidx || '',
            pageNo:args.pageNo || '',
            searchName:args.searchName || '',
            searchProductStatus:args.searchProductStatus || '',
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//获取地理位置信息
export const insertReportShare = function(args){
    ajaxFn({
        url:'business/insertReportShare',
        data:{
            shareUserId:args.shareUserId,
            reportId:args.reportId
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//金宝箱活动
export const glodBox = function(args){
    ajaxFn({
        url:'partakeActivity/glodBox',
        data:{
            username:args.username || "",
            phone:args.phone || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//银宝箱活动
export const cashBox = function(args){
    ajaxFn({
        url:'partakeActivity/cashBox',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//目录分组
export const getCatalogList = function(args){
    ajaxFn({
        url:'business/getCatalogList',
        data:{
            searchName:args.searchName || "",
            max:args.max,
            min:args.min,
            catalogId:args.catalogId,
            catalogTypeId:args.catalogTypeId,
            pageNo:args.pageNum
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//目录分组
export const getCatalogInfo = function(args){
    ajaxFn({
        url:'business/getCatalogInfo',
        data:{
            searchName:args.searchName || "",
            catalogId:args.catalogId,
            tongyongmingZl:args.tongyongmingZl,
            catalogTypeId:args.catalogTypeId,
            pageNo:args.pageNum
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//目录类型
export const getCatalogTypeList = function(args){
    ajaxFn({
        url:'business/getCatalogTypeList',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//入市价数据源-省份
export const getProvinceList = function(args){
    ajaxFn({
        url:'business/getProvinceList',
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//入市价数据源
export const getEntryPriceSource = function(args){
    ajaxFn({
        url:'business/getEntryPriceSource',
        data:{
            searchName:args.searchName || "",
            provinceId:args.provinceId,
            pageNo:args.pageNum
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//首页数据加载
export const getHQFirstPage = function(args){
    ajaxFn({
        url:'business/getHQFirstPage',
        data:{
            pageNo:args.pageNo || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//医院市场介绍全文
export const getHosInfoDetail = function(args){
    ajaxFn({
        url:'business/getHosInfoDetail',
        data:{
            id:args.id || "",
            pageNo:args.pageNo || "",
            pageSize:args.pageSize || "",
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}


//市场行情数据加载
export const getMarketInfo = function(dispatch,args){

    var params ={
        yearMonth:args.yearMonth,
        areaId:args.areaId,
        searchAreaType:args.searchAreaType,
        callBack:args.callBack || function(){}
    }
    ajaxFn({
        url:'business/getMarketInfo',
        data:{
            yearMonth:params.yearMonth,
            areaId:params.areaId,
            searchAreaType:params.searchAreaType
        },
        callBack:(res)=>{
            if(res.state == 1){
                params.callBack(res);
            }else{
                alert(res.message);
            }
        }
    })
}


//厂家影响力信息数据加载
export const getBusinessFactoryInfo = function(dispatch,args){
    var params ={
        yearMonth:args.yearMonth,
        areaId:args.areaId,
        searchAreaType:args.searchAreaType,
        breedId:args.breedId,
        pageNo:args.pageNo,
        sord:args.sord,
        sidx:args.sidx,
        searchName:args.searchName,
        callBack:args.callBack || function(){}
    }
    ajaxFn({
        url:'business/getBusinessFactoryInfo',
        data:{
            yearMonth:params.yearMonth,
            areaId:params.areaId,
            searchAreaType:params.searchAreaType,
            breedId:params.breedId || "",
            pageNo:params.pageNo || "",
            sord:params.sord || "",
            sidx:params.sidx || "",
            searchName:params.searchName || "",
            pageSize:15,
        },
        callBack:(res)=>{
            if(res.state == 1){
                params.callBack(res);
            }else{
                alert(res.message);
            }
        }
    })
}

//产品信息数据加载
export const getBusinessFactoryProdInfo = function(args){
    ajaxFn({
        url:'business/getBusinessFactoryProdInfo',
        data:{
            isCity:args.isCity || "",
            areaId:args.areaId || "",
            yearMonth:args.yearMonth || "",
            breedId:args.breedId || "",
            pageNo:args.pageNo || "",
            yytj:args.yytj || "",
            sord:args.sord || "",
            sidx:args.sidx || "",
            searchName:encodeURI(encodeURI(args.searchName)) || "",
            searchAreaType:args.searchAreaType || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//首页搜索产品信息接口
export const getBusinessFirstFacProdInfo = function(args){
    ajaxFn({
        url:'business/getBusinessFirstFacProdInfo',
        data:{
            areaId:args.areaId || "",
            yearMonth:args.yearMonth || "",
            pageNo:args.pageNo || "",
            sord:args.sord || "",
            sidx:args.sidx || "",
            searchName:args.searchName || "",
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//签到
export const getSign = function(args){
    ajaxFn({
        url:'business/getSign',
        data:{
            userId:args.userId
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//客户经理搜索列表
export const getAccountManagerlist = function(args){
    ajaxFn({
        url:'business/getAccountManagerlist',
        data:{
            userId:args.userId,
            searchName:args.searchName,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//我的客户列表
export const myCustomerList = function(args){
    ajaxFn({
        url:'business/myCustomerList',
        data:{
            //userId:args.userId,
            //searchName:args.searchName,
            pageNo:args.pageNo
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//绑定客户经理
export const checkedAccountManager = function(args){
    ajaxFn({
        url:'business/switchAccountManager',
        data:{
            userId:args.userId,
            accountManagerId:args.accountManagerId
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//客户经理协议内容
export const getAccountManagerAgreement = function(args){
    ajaxFn({
        url:'business/getAccountManagerAgreement',
        data:{
            userId:args.userId,
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//成为客户经理
export const addAccountManager = function(args){
    ajaxFn({
        url:'business/addAccountManager',
        data:{
            userId:args.userId,
            name:args.name,
            birth:args.birth,
            location:args.location,
            phoneNumber:args.phoneNumber,
            organization:args.organization,
            specially:args.specially
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//客户经理业务专长
export const getAccountManagerSpecialty = function(args){
    ajaxFn({
        url:'business/getAccountManagerSpecialty',
        data:{
            userId:args.userId
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//邀请客户
export const invitationCustomer = function(args){
    ajaxFn({
        url:'business/invitationCustomer',
        data:{
            userId:args.userId
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//订阅专栏
export let subscribeColumn = function(args){
    ajaxFn({
        url:'business/subscribeColumn',
        data:{
            columnId:args.columnId,
            userPhone:args.userPhone
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//保存客户
export let saveCustomer = function(args){
    ajaxFn({
        url:'business/saveCustomer',
        data:{
            userId:args.userId,
            managerId:args.managerId
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}


//请求腾讯地图服务地址
export const getTencentMap = function(args){
    ajaxFn({
        url:'business/getNearbyInfo',
        data:{
            place:args.place,
            lat:args.lat,
            long:args.long,
            around:args.around,
        },
        callBack:(res)=>{
            res.datas = JSON.parse(res.datas);
            args.callBack(res);
        }
    })
}

//问卷调查
export const saveInvestigation = function(args){
    ajaxFn({
        url:'business/saveInvestigation',
        data:{
            data:args.datas
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//客户积分支付
export const getCustomerScorePay = function(args){
    ajaxFn({
        url:'business/getCustomerScorePay',
        data:{
            reportId:args.reportId,
            productId:args.productId
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//是否已开通7天会员接口
export const isGetSevenDaysVIP = function(args) {
    ajaxFn({
        url: 'business/isGetSevenDaysVIP',
        callBack: (res)=> {
            args.callBack(res);
        }
    })
}

//7天会员接口
export const openSevenDaysVIP = function(args){
    ajaxFn({
        url:'business/openSevenDaysVIP',
        data:{
            place:args.place,
            lat:args.lat,
            long:args.long,
            around:args.around,
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
};
//搜索列表
export const indexList = function(args){
    ajaxFn({
        url:'business/solrSearch',
        data:{
            searchName:args.searchName || "",
            pageNo:args.pageNo || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//搜索列表
export const getSynopsis = function(args){
    ajaxFn({
        url:'pub/getSynopsis',
        data:{
            reportId:args.reportId
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//记录搜索信息
export const saveIndexLog = function(args){
    ajaxFn({
        url:'business/saveIndexLog',
        data:{
            userId:args.userId || "",
            searchName:args.searchName || "",
            smallType:args.smallType || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//历史搜索记录
export const getIndexHistory = function(args){
    ajaxFn({
        url:'business/getIndexHistory',
        data:{
            userId:args.userId || "",
            smallType:args.smallType || "",
            pageNo:args.pageNo || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//热门搜索
export const getHotIndex = function(args){
    ajaxFn({
        url:'business/getHotIndex',
        data:{
            pageNo:args.pageNo || ""
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}
//论坛
export const baseUserSynchronous = function(args){
    ajaxFn({
        url:'business/baseUserSynchronous',
        data:{
            userId:args.userId
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//返回论坛数据
export const selectBaseBbsList = function(args){
    ajaxFn({
        url:'business/selectBaseBbsList',
        data:{
            userId:args.userId
        },
        callBack:(res)=>{
            args.callBack(res);
        }
    })
}

//请求支付
export const requestUnifiedorderPayService = function(args){
    let message = '';
    $.ajax({
        type: "POST",
        url:httpAddress+"pay/requestUnifiedorderPayService",
        data:{
            productId:args.id,
            discount:args.discount
        },
        async: false,
        error: function(request) {
            status = 'error';
            message = '系统异常，请稍后重试！';
        },
        success: (ret)=> {
            var state = ret.state;
            if(state == "1") {
                try {
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady',
                                args.callBack(), false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady',  args.callBack());
                            document.attachEvent('onWeixinJSBridgeReady',  args.callBack());
                        }
                    } else {
                        args.callBack(ret.data,args.fun)
                    }
                } catch (e) {
                    alert(e);
                }
                window.event.returnValue = false;
                return false;
            }
        }
    });
}


function ajaxFn(params){
    var params = {
        url:params.url || "",
        method:params.method || 'POST',
        data:params.data || {},
        callBack:params.callBack || function(){}
    };
    //每次请求把请求加入队列
    ajaxQueues.push(params);
    //异步请求主体
    function bodyAjax(params){
        $.ajax({
            url:httpAddress +params.url,
            method:params.method,
            data:params.data
        }).then((res)=>{
            params.callBack(res);
        })
    }

    function beginAjax(){
        ajaxQueues.forEach((e)=>{
            bodyAjax({
                url:e.url,
                method:e.method,
                data:e.data,
                callBack:function(res){
                    e.callBack(res);
                }
            })
        });
        //清空循环队列
        ajaxQueues = [];
    }

    if(!store.getState().userInfo.isLogin && !isGetUsering){
        isGetUsering = true;
        bodyAjax({
            url:'business/getInitWxUser',
            data:{
                code: url2obj().code
            },
            callBack:(res)=>{
                isGetUsering = false;
                if (res.datas) {
                    if(typeof url2obj().managerId != 'undefined'){
                        saveCustomer({
                            userId:res.datas.id,
                            managerId:url2obj().managerId,
                            callBack:(res)=>{}
                        })
                    }
                    store.dispatch({
                        type: 'LOADUSERINFO',
                        datas: res.datas
                    });
                    store.dispatch({
                        type: 'LOGIN'
                    });
                    store.dispatch({
                        type: "CHANGE",
                        areaName: res.datas.areaName,
                        areaId: res.datas.areaId,
                        searchAreaType: res.datas.searchAreaType
                    });
                    store.dispatch({
                        type: "CHANGEALLPROVINCEIDNAME",
                        provinceName: res.datas.provinceName,
                        provinceId: res.datas.provinceId
                    });
                    store.dispatch({
                        type: "CHANGEDATA",
                        yearMonth: res.datas.yearMonth
                    });
                    name = res.datas.id;
                    setTimeout(()=>{
                        beginAjax();
                    })
                    }
            }
        });
    }else{
        //循环请求队列
        beginAjax();
    }
}