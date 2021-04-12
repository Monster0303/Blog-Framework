import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import { message, List, Pagination } from 'antd';
import { inject, parse_qs } from '../utils'

import PostService from '../service/post';

import 'antd/lib/message/style';
import 'antd/lib/list/style';
import 'antd/lib/pagination/style';


const service = new PostService

@inject({ service })
@observer
export default class Getall extends React.Component {
    constructor(props) {   // 现在前端路由有 react-router 管理，它匹配路径后，会注入组件的 props 中
        super(props)
        let { location: { search } } = props  // 对象解构：从 props 中解构出 location，再解构出 search
        this.props.service.getall(search)
    }

    handlerChangePage(page, pageSize) {
        let search = `?page=${page}&size=${pageSize}`
        this.props.service.getall(search)
        // window.location.href = `/getall${search}`  // 同步模式，会整页刷新
    }

    geturl(pageNum) {
        let { size = 3 } = this.props.service.pagination;    // 从 pagination 中拿 zise
        // let { size } = parse_qs(this.props.location.search) // 也可以从 props 中获取 size，但是没有验证值的合法性

        return `/getall?page=${pageNum}&size=${size}`
    }

    /**
     * 自定义翻页
     * @param current 当前pageNo页号
     * @param type    当前类型，上一页为prev，下一页为next，页码为page
     * @param originalElement   React.ReactNode
     */
    itemhandler(current, type, originalElement) {
        if (type === 'prev') {
            if (current == 0) { // 点击前一页会返回 0，只能屏蔽它
                return originalElement;
            }
            return <Link to={this.geturl(current)} className='ant-pagination-item-link'>{'<'}</Link>;
        }

        if (type === 'next') {
            return <Link to={this.geturl(current)} className='ant-pagination-item-link'>{'>'}</Link>
        }

        if (type === 'page') {
            return <Link to={this.geturl(current)}>{current}</Link>;
        }

        return originalElement;
    }

    render() {
        console.log('list refesh ~~~~~~~~~~~~~~~')

        let data = this.props.service.posts;  // 是个列表，包含一个个的 post 对象，每个 post 内有：'post_id' 'author' 'pub_time' 'title'
        // let data = []

        if (data.length) {  // 判断结果是否为空

            let pagination = this.props.service.pagination;

            if (this.props.service.msg) {
                message.error(this.props.service.msg, 2, () => this.props.service.msg = '')
            }

            return (    // bordered 边线
                <div>
                    <List bordered={true} itemLayout="horizontal"
                        dataSource={data}   // 给定数据源，会迭代 data，把一个个 post 取出来到下面的 item
                        renderItem={item => (  // 渲染每一行，给定一个一参函数，迭代每一行
                            <List.Item>
                                <List.Item.Meta
                                    title={<Link to={"/getpage/" + item.post_id}>{item.title}</Link>}
                                    // description={'发布时间：' + item.pub_time}
                                    description={'发布时间：' + new Date(item.pub_time * 1000).toLocaleString()}
                                />
                            </List.Item>
                        )}
                    // pagination={{
                    //     onChange: this.handlerChangePage.bind(this),
                    //     pageSize: pagination.size, // 每页多少行
                    //     total: pagination.posts_count, // 数据总数
                    //     current: pagination.page,    // 当前页数
                    //     itemRender: this.itemhandler.bind(this)
                    // }}
                    />
                    <Pagination defaultCurrent={1}
                        onChange={this.handlerChangePage.bind(this)}
                        pageSize={pagination.size}
                        total={pagination.posts_count}
                        current={pagination.page}
                        itemRender={this.itemhandler.bind(this)}
                    />
                </div>
            )
        } else {
            return (<List />)
        }
    }
}