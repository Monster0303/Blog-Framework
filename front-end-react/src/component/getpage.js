import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import { message, Card } from 'antd';
import { inject } from '../utils'

import PostService from '../service/post';

import 'antd/lib/message/style';
import 'antd/lib/card/style';


const service = new PostService

const gridStyle = {
    width: '100%',
    textAlign: 'center',
};

@inject({ service })
@observer
export default class Getall extends React.Component {
    constructor(props) {   // 现在前端路由有 react-router 管理，它匹配路径后，会注入组件的 props 中
        super(props)
        let { id } = props.match.params  // 对象解构：从 props 中解构出 location，再解构出 search
        this.props.service.getpage(id)
    }


    render() {
        let post = this.props.service.post

        // 'post': {
        //     'author_id': post.author_id,
        //     'post_id': post.id,
        //     'title': post.title,
        //     'pub_time': int(post.pub_time.timestamp()),
        //     'content': post.content.content
        // }
        return (

            <div>
                <Card title={post.title} extra={<a href="#">More</a>} style={{ width: 1000 }}>
                    <Card.Grid style={gridStyle}><Link to={'/' + post.author_id}>查看作者</Link></Card.Grid>
                    <Card.Grid style={gridStyle}>发布时间：{new Date(post.pub_time * 1000).toLocaleString()}</Card.Grid>
                </Card >

                <Card style={{ width: 1000 }}>
                    <p>{post.content}</p>
                </Card>
            </div >
        )
    }
}