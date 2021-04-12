import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import '../css/login.css';
import UserService from '../service/user';
import { observer } from 'mobx-react';
import { message, Button } from 'antd';
import 'antd/lib/message/style';
import { inject } from '../utils'


const service = new UserService()

// 变形为使用高阶装饰器 inject
// export default class Reg extends React.Component {
//     render() {
//         return (
//             <_Reg service={service} />
//         )
//     }
// }

@inject({ service })
@observer
export default class Reg extends React.Component {

    handleClick(event) {
        event.preventDefault();
        let fm = event.target.form
        this.props.service.reg(fm[0].value, fm[1].value, fm[2].value)    // 异步提交
    }

    render() {
        if (this.props.service.msg) {
            message.error(this.props.service.msg, 2, () => { this.props.service.msg = '' })
        }

        if (this.props.service.loggedin) {
            console.log('observer change', this.props.service.loggedin)
            return <Redirect to='/' />
        }

        console.log('reg refesh ~~~~~~~~~~~~~~~')
        return (
            <div className="login-page">
                <div className="form">
                    <form className="register-form">
                        <input type="text" placeholder="姓名" />
                        <input type="text" placeholder="邮箱" />
                        <input type="password" placeholder="密码" />
                        <input type="password" placeholder="确认密码" />
                        <button onClick={this.handleClick.bind(this)}>注册</button>
                        <p className="message">如果已经注册 <Link to="/login">请登录</Link></p>
                    </form>
                </div>
            </div>
        );
    }
}