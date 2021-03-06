import React,{Component} from 'react';
import {Link} from 'react-router';
import {store} from './function/ajax';
export default class ReportList extends Component {
	constructor(props){
		super(props);
		this.state={
			showPopup:false
		};
	}
	uptime(){
		this.props.dispatch({
			type:'SHOWCOLLECTPOPUP',
			showCollectPopup:true,
			showCollectPopupID:this.props.dataSources.id
		})
	}
	touchStart(event){
		if(this.props.collect){
			var downtime,uptime;
			var date=new Date();
			this.downtime = date.getTime();
			this.sss=setTimeout(()=>{
				this.uptime()
			},800);
		}
	}
	touchMove(){
		clearTimeout(this.sss);
	}
	touchEnd(){
		clearTimeout(this.sss);
	}
	componentWillUnmount(){
		clearTimeout(this.sss);
	}
	render(){
		var string = null;
        var iconTag = null;
		var tag = (()=>{
			if(this.props.BuyReportList || this.props.dataSources.buyReport == 1){
				string = <i className="item-icon">点击查看</i>;
			}else{
				if(this.props.dataSources.costStatus == "1"){
					string = <i className="item-icon">报告试读</i>;
//            增加活动标签区域        
//                    iconTag = <span className="icon-tag"></span>
				}else{
					string = <i className="item-icon">点击查看</i>;
				}
			}
			return string;
		})();
        
		if(this.props.reportTag || this.props.BuyReportList){
			var number = (()=>{
				if(this.props.dataSources.costStatus == "1"){
					string = <span style={{textAlign:"left"}}><i className="fa fa-shopping-cart"></i>{this.props.dataSources.orderNum}人购买<i className="fa fa-eye fa-mglf"></i>{this.props.dataSources.readNum}人查看</span>;
				}else{
					string =<span style={{textAlign:"left"}}><i className="fa fa-eye"></i>{this.props.dataSources.readNum}人查看</span>;
				}
				return string;
			})();
		}else{
			var number = (()=>{
				if(this.props.dataSources.costStatus == "1"){
					string = <span style={{textAlign:"left"}}><i className="fa fa-shopping-cart"></i>{this.props.dataSources.orderNum}人购买<i className="fa fa-eye fa-mglf"></i>{this.props.dataSources.readNum}人查看</span>;
				}else{
					string =<span style={{textAlign:"left"}}><i className="fa fa-eye"></i>{this.props.dataSources.readNum}人查看</span>;
				}
				return string;
			})();
		}
		if(this.props.dataSources.price == null || this.props.dataSources.price == undefined){
			this.state= {
				price: 0
			}
		}else{
			this.state= {
				price: this.props.dataSources.price
			}
		}
		return(
			<div>
				{
					this.props.collect&&this.props.dataSources.columnId!="1"
						?<Link onTouchStart={this.touchStart.bind(this)}  onTouchEnd={this.touchEnd.bind(this)}  onTouchMove={this.touchMove.bind(this)} to={`/subscribeContent/${this.props.dataSources.columnId}/${this.props.dataSources.id}/${this.props.dataSources.typeName}`}  className="item">
						<div className="item-left">
							<img src={this.props.dataSources.mainImg} alt=""/>
						</div>
						{
							this.props.collect
								?<div className="item-right">
								<h2> {this.props.dataSources.columnName}</h2>
								<h3 className="item-nowrap dark">{iconTag} {this.props.dataSources.title}</h3>
								<div className="item-right-footer">
									{this.props.dataSources.publishDate}
								</div>
							</div>
								:<div className="item-right">
								<h3 className="item-nowrap">{iconTag} {this.props.dataSources.title}</h3>
								<p>¥{this.state.price}</p>
								<div className="item-right-footer">
									{number}
									{tag}
								</div>
							</div>
						}
					</Link>
					:<Link onTouchStart={this.touchStart.bind(this)}  onTouchEnd={this.touchEnd.bind(this)}  onTouchMove={this.touchMove.bind(this)}  to={`/pay/pdf/${this.props.dataSources.id}`}  className="item">
						<div className="item-left">
							<img src={this.props.dataSources.mainImg} alt=""/>
						</div>
						{
							this.props.collect
								?<div className="item-right">
								<h2> {this.props.dataSources.columnName}</h2>
								<h3 className="item-nowrap dark">{iconTag} {this.props.dataSources.title}</h3>
								<div className="item-right-footer">
									{this.props.dataSources.publishDate}
								</div>
							</div>
								:<div className="item-right">
								<h3 className="item-nowrap">{iconTag} {this.props.dataSources.title}</h3>
								<p>¥{this.state.price}</p>
								<div className="item-right-footer">
									{number}
									{tag}
								</div>
							</div>
						}
					</Link>
					}
			</div>
		)
	}
}
