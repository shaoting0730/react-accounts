import React, { Component } from 'react';
import Record from './Record'
import RecordForm from './RecordForm'
import Box from './Box'
import axios from 'axios'

export default class Records extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            error:null,  //网络错误信息
            isLoader:true, //加载标示
            records:[]  //数据
        };
    }


    render() {
        //根据 error isLoader 显示不同UI
        //如果error有值,显示errorUI
        //如果isLoader 为true,显示加载UI
        //如果isLoader 为false,显示正确数据UI

        const {error,isLoader,records} = this.state
        let renderRecords;
        if(error){
            renderRecords =  <div>出错了:{error}</div>
        }else  if(isLoader){
            renderRecords =   <div><img src={require('./loading.gif')} /></div>
        }else {
            renderRecords =   (
                <div>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>日期</th>
                            <th>标题</th>
                            <th>金额</th>
                            <th>事件</th>

                        </tr>
                        </thead>
                        <tbody>
                        {records.map((item,index)=>
                            <Record
                                key ={item.id}
                                record={item}
                                updateData={this.updateRecord.bind(this)}
                                deleteData={this.deleteRecord.bind(this)}
                            />
                        )}
                        </tbody>
                    </table>
                </div>
            );
        }

        return(
            <div>
                <h2>消费记录</h2>
                <div className="row mb-3">
                    <Box text="收入" type="success" amount={this.credits()} />
                    <Box text="支出" type="danger" amount={this.debits()} />
                    <Box text="余额" type="info" amount={this.balance()} />
                </div>
                <RecordForm handleNewRecord = {this.addRecord.bind(this)} />
              {renderRecords}
            </div>
        )
    }


    /**
     * 收入计算
     * */
    credits() {
        let credits = this.state.records.filter((record) => {
            return record.account >= 0;
        })

        return credits.reduce((prev, curr) => {
            return prev + Number.parseInt(curr.account, 0)
        }, 0)
    }
    /**
     * 支出计算
     * */
    debits() {
        let credits = this.state.records.filter((record) => {
            return record.account < 0;
        })

        return credits.reduce((prev, curr) => {
            return prev + Number.parseInt(curr.account, 0)
        }, 0)
    }
    /**
     * 余额计算
     * */
    balance() {
        return this.credits() + this.debits();
    }

    /**
     * 更新账单
     * */
    updateRecord(record, data) {
        const recordIndex = this.state.records.indexOf(record);
        const newRecords = this.state.records.map( (item, index) => {
            if(index !== recordIndex) {
                // This isn't the item we care about - keep it as-is
                return item;
            }

            // Otherwise, this is the one we want - return an updated value
            return {
                ...item,
                ...data
            };
        });
        this.setState({
            records: newRecords
        });
    }
    /**
     * 删除账单
     * */
    deleteRecord(record){
        // console.log(record)
        const recordIndex = this.state.records.indexOf(record);
        const newRecords = this.state.records.filter( (item, index) => index !== recordIndex);
        this.setState({
            records: newRecords
        });
    }

    /**
     * 把最新数据赋值state
     * */
    addRecord (record) {
        console.log(record)
        this.setState({
            error:null,
            isLoader:false, //加载标示
            records:[
                ...this.state.records,
                record
            ]
        })

    }

    //请求数据
    componentDidMount() {
        var that = this
        axios.get('http://5b3450a9d167760014c265b5.mockapi.io/accounts/v1/accounts')
            .then(response =>
                that.setState({
                    isLoader:false,
                    records:response.data
                })
            )
            .catch(err =>
                that.setState({
                    error:err.message,
                })
            )


    }

}



