/*
    微信授权
*/
import {connect} from 'react-redux';
import {loadWx,loadJssdk,getUserAreaInfo,insertReportShare} from './ajax';
import {url2obj} from './common';
import {WXKEY,HTTPURL} from '../config';
var isLogin = false;
export const Token = function(fn,store){
    if(store.getState().userInfo.isLogin||url2obj().code){
        // 分享
        loadJssdk({
            uri:location.href,
            callBack:(res) => {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: WXKEY, // 必填，公众号的唯一标识
                    timestamp: res.datas.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.datas.nonceStr, // 必填，生成签名的随机串
                    signature: res.datas.signature, // 必填，签名，见附录1
                    jsApiList: ['getLocation', 'onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function() {
                     wx.getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function(res) {
                            //获取地理位置信息接口
                            getUserAreaInfo({
                                latitude:res.latitude,
                                longitude: res.longitude,
                                callBack:(res)=>{
                                    fn(res);
                                }
                            })
                        },
                        cancel:function(res){
                            getUserAreaInfo({
                                latitude:'23.129387',
                                longitude: '113.31559',
                                callBack:(res)=>{
                                    fn(res);
                                }
                            })
                        },
                        error:function(res){
                            getUserAreaInfo({
                                latitude:'23.129387',
                                longitude: '113.31559',
                                callBack:(res)=>{
                                    fn(res);
                                }
                            })
                        },
                        fail:function(res){
                            getUserAreaInfo({
                                latitude:'23.129387',
                                longitude: '113.31559',
                                callBack:(res)=>{
                                    fn(res);
                                }
                            })
                        }
                     })
                     // 分享
                    var info = {
                        title: '药市通-首个医药圈的信息分享平台',
                        link: HTTPURL+"?recommender="+name,
                        imgUrl: HTTPURL+'/pub/resources/sysres/logo.jpg',
                        desc: ' 提供历年中标数据、广东省入市价、政策准入、质量层次等数据查询 ，提供行业分析报告，共享分成。'
                    };
                    wx.onMenuShareTimeline({
                        title: info.title, // 分享标题
                        link: info.link, // 分享链接
                        imgUrl: info.imgUrl, // 分享图标
                        success: function() {
//                                $.toast('分享成功！');
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: info.title,
                        desc: info.desc, // 分享描述
                        link: info.link, // 分享链接
                        imgUrl: info.imgUrl, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function() {
                            // 用户确认分享后执行的回调函数
//                                $.toast('分享成功！');
                        },
                        trigger:function(){
                            alert('trigger');
                        }
                    });
                });
                wx.error(function(){
                    // 分享
                    var info = {
                        title: '药市通-首个医药圈的信息分享平台',
                        link: HTTPURL+"?recommender="+name,
                        imgUrl: HTTPURL+'/pub/resources/sysres/logo.jpg',
                        desc: ' 提供历年中标数据、广东省入市价、政策准入、质量层次等数据查询 ，提供行业分析报告，共享分成。'
                    };
                    wx.onMenuShareTimeline({
                        title: info.title, // 分享标题
                        link: info.link, // 分享链接
                        imgUrl: info.imgUrl, // 分享图标
                        success: function() {
//                                $.toast('分享成功！');
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: info.title,
                        desc: info.desc, // 分享描述
                        link: info.link, // 分享链接
                        imgUrl: info.imgUrl, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function() {
                            // 用户确认分享后执行的回调函数
//                                $.toast('分享成功！');
                        }
                    });
                })
            }
        })
    }else{
        var _recommender = url2obj().recommender;
        var reportId = url2obj().id;
        var URL;
        if(_recommender == undefined){
            _recommender = "";
            //URL=HTTPURL+location.pathname;
            URL=HTTPURL
        }else{
            URL=HTTPURL+location.pathname;
            if(sessionStorage.getItem("reportId")){
                sessionStorage.setItem("recommender", _recommender);
                sessionStorage.setItem("reportId", url2obj().reportId);
            }
        }
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+WXKEY+'&redirect_uri='+URL+'?recommender='+_recommender+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
        return;
    }
}
