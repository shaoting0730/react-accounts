import React, { Component } from 'react';
import axios from 'axios'

export default class RecordForm extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            date:"",
            title:"",
            account:""
        };
      }
      /**
       * 判断按钮是否可用
       * */

      valid(){
          return this.state.date && this.state.title && this.state.account;
      }

      /**
       * 输入改变触发
       * */
    handleChange (event){
          let name,obj;
          name = event.target.name;
          this.setState((
            obj = {},
            obj["" + name] = event.target.value,
            obj
          ))
    }
    /**
     * 提交按钮触发
     * */

    handleSubmit (event){
        event.preventDefault()
        var that = this
        axios.post('http://5b3450a9d167760014c265b5.mockapi.io/accounts/v1/accounts',{
            date:that.state.date,
            title:that.state.title,
            account:that.state.account
         })
            .then(response =>{
                console.log(response);
                this.props.handleNewRecord(response.data)
                that.setState({
                    date:"",
                    title:"",
                    account:""
                })

            })
            .catch(err =>
                that.setState({
                    error:err.message,
                })
            )
    }

    render() {
        return (
            <form className="form-inline mb-2" onSubmit={this.handleSubmit.bind(this)} >
                <div className="form-group mr-1">
                    <input type="text" onChange={this.handleChange.bind(this)} value={this.state.date} className="form-control" placeholder="时间" name="date" />
                </div>
                <div className="form-group mr-1">
                    <input type="text" onChange={this.handleChange.bind(this)} value={this.state.title} className="form-control" placeholder="标题" name="title" />
                </div>
                <div className="form-group mr-1">
                    <input type="text" onChange={this.handleChange.bind(this)} value={this.state.account} className="form-control" placeholder="账目" name="account" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={!this.valid()} >创建</button>
            </form>
        );
    }

}


