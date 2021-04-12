import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import { message, Button, Form, Input } from 'antd';
import { inject } from '../utils'
import PostService from '../service/post';
import 'antd/lib/message/style';
import 'antd/lib/form/style';
import 'antd/lib/input/style';
import 'antd/lib/button/style';



const { TextArea } = Input;

const service = new PostService

@inject({ service })
@observer
export default class Put extends React.Component {

    handleSubmit(event) {
        event.preventDefault();
        let fm = event.target;
        this.props.service.pub(fm[0].value, fm[1].value)    // 异步提交
    }

    render() {
        console.log('pub refesh ~~~~~~~~~~~~~~~')

        if (this.props.service.msg) {
            message.info(this.props.service.msg, 2, () => { this.props.service.msg = '' });
            return <Redirect to={'/getpage/' + this.props.service.post_id}/>
        }

        // FormItem 表单项，label 设置控件前的标题，labelCol 设置 label 的宽度，wrapperCol 是 label 后占用的宽度
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit.bind(this)}>
                <Form.Item label="标题" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                    <Input placeholder="标题"/>
                </Form.Item>

                <Form.Item label="内容" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                    <TextArea rows={20} placeholder="正文"/>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 2, offset: 20 }}>
                    <Button type="primary" htmlType="submit">发布</Button>
                </Form.Item>
            </Form>
        );
    }
}