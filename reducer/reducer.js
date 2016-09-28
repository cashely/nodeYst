import {combineReducers} from 'redux';
import index from './index';
import provicen from './provicen';
import data from './data';
import router from './router';
import hospital from './hospital';
import feedBack from './feedBack';
import drug from './drug';
import drugContent from './drugContent';
import report from './report';
import userInfo from './userInfo';
import defaultArea from './defaultArea';
import home from './home';
import marketPrice from './marketPrice';
import bidList from './bidList';
import policy from './policy';
import insurance from './insurance';
import base from './base';
import assist from './assist';
import lowPrice from './lowPrice';
import anti from './anti';
//合并仓库

const ystReducers = combineReducers({
	index,
	provicen,
	data,
	router,
    report,
    hospital,
    feedBack,
    drug,
    userInfo,
    drugContent,
    defaultArea,
    home,
    marketPrice,
    bidList,
    policy,
    insurance,
    base,
    assist,
    lowPrice,
    anti
})
export default ystReducers;