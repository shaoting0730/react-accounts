import React, { Component } from 'react';
import moment from "moment";  //日期格式
import axios from 'axios'

export default class Record extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            edit:false  //编辑按钮状态
        };
      }

    render() {
        //如果编辑状态为true,显示编辑状态,否则显示默认状态
        if(this.state.edit){
            return this.renderEditRow()
        }else {
            return this.renderRow()
        }
    }


    renderEditRow () {
         var date = this.props.record.date
         var newDate = moment(date).format('YYYY-MM-DD');
        return (
            <tr>
                <td><input type="text" className="form-cantrol" defaultValue={newDate} ref="date" /></td>
                <td><input type="text" className="form-cantrol" defaultValue={this.props.record.title} ref="title" /></td>
                <td><input type="text" className="form-cantrol" defaultValue={this.props.record.account} ref="account" /></td>
                <td>
                    <button className="btn btn-info mr-1" onClick={this.handleUpdate.bind(this)}>更新</button>
                    <button className="btn btn-danger " onClick={this.handleToggle.bind(this)}>取消</button>
                </td>
            </tr>
        );
    }

    renderRow () {
        var date = this.props.record.date
        var newDate = moment(date).format('YYYY-MM-DD');
        return (
            <tr>
                <td>{newDate}</td>
                <td>{this.props.record.title}</td>
                <td>{this.props.record.account}</td>
                <td>
                    <button className="btn btn-info mr-1" onClick={this.handleToggle.bind(this)}>编辑</button>
                    <button className="btn btn-danger" onClick={this.handleDelete.bind(this)}>删除</button>
                </td>
            </tr>
        );
    }

    /**
     * 编辑按钮点击事件
     * 对state edit做取反操作
     * */
    handleToggle () {
          this.setState({
              edit:!this.state.edit
          })
    }

    /**
     * 删除 按钮点击事件
     * */
    handleDelete (event) {
        event.preventDefault()

        var that = this
        // alert(that.props.record.id)
        axios.delete('http://5b3450a9d167760014c265b5.mockapi.io/accounts/v1/accounts/' + that.props.record.id)
            .then(response =>{
                console.log(response)
               this.props.deleteData(that.props.record)
            })
            .catch(err =>{

            })


    }

   /**
    * 更新记录事件
    * */
    handleUpdate (event) {
      event.preventDefault() // 方法阻止元素发生默认的行为

        const record ={
          date:this.refs.date.value,
          title:this.refs.title.value,
          account:this.refs.account.value
      }

        var that = this
        // alert(that.props.record.id)
        axios.put('http://5b3450a9d167760014c265b5.mockapi.io/accounts/v1/accounts/' + that.props.record.id,{
            date:record.date,
            title:record.title,
            account:record.account
        })
            .then(response =>{
                this.props.updateData(this.props.record,response.data)
                this.setState({
                    edit:false
                })
            })
            .catch(err =>
                that.setState({
                    error:err.message,
                })
            )


    }



}


