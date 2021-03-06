/*
    分类涨幅榜品种信息
*/

import React,{Component} from 'react';
import {Link} from 'react-router';
export default class BreedSingle extends Component{
	render(){
        var string = null;
        var change = (()=>{
            if (this.props.data.change == "" ) {
                string=""
            } else if (this.props.data.change >= 0 ) {
                string=<div className="col col-flex-last text-center assertive">{this.props.data.change}%</div>
            } else {
                string=<div className="col col-flex-last text-center balanced">{this.props.data.change}%</div>
            }
            return string;
        })();
        var changeCost = (()=>{
            if (this.props.data.changeCost >= 0 ) {
                string=<div className="col text-center assertive">{this.props.data.changeCost}</div>
            } else {
                string=<div className="col text-center balanced">{this.props.data.changeCost}</div>
            }
            return string;
        })();
        if(this.props.data){
            const sid = this.props.data.salesId || this.props.data.conceptId;
            return(
                <Link to={`/market/marketSearch/marketSearchDetail/${encodeURIComponent(this.props.data.genericName)}/${this.props.data.id}/${this.props.data.icoType}`} className="row item" style={{ padding: '10px',fontSize: '.6rem'}}>
                    <h3 className="col" style={{fontSize: '.6rem'}}><span className="tag" style={{background: '#16b028'}}>{this.props.data.icoType}</span>{this.props.data.genericName}</h3>
                    <div className="col  text-center">{this.props.data.sales}</div>
                    {changeCost}
                    {change}
                </Link>
            )
        }else{
            return(
                <div>null</div>
            )
        }
		
	}
}