import React, {
	Component
}
from 'react';

import FooterBarIcon from './footerBarIcon.js';
export
default class FooterBar extends Component {
	_footerBarHandle(e){
		this.props.dispatch({
			type:'ROUTER',
			router:e
		})
	}
	render() {
		var menus = [{
			uri: 'home',
			title: '首页',
			icon: 'ios-home'
		}, {
			uri: 'produce',
			title: '产品',
			icon: 'cube'
		}, {
			uri: 'index',
			title: '行情',
			icon: 'earth'
		}, {
			uri: 'hospital',
			title: '医院',
			icon: 'erlenmeyer-flask'
		}, {
			uri: 'center',
			title: '个人中心',
			icon: 'happy'
		}];
		return (
			<div className="tabs tabs-icon-top">
					{
						menus.map((ele) => {
							return (
								<FooterBarIcon fn={this._footerBarHandle.bind(this,ele.uri)} style={ele.uri == this.props.uri ? styles.active : null} key={ele.title} icon={ele.icon} title={ele.title}/>
							)
						})
					}
				</div>
		)

	}
}
const styles = {
	active:{
		color:'#0284D0'
	}
}