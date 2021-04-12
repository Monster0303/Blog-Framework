import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import '../css/login.css';
import UserService from '../service/user';
import { observer } from 'mobx-react';
import { message, Button } from 'antd';
import 'antd/lib/message/style';
import { inject } from '../utils'
import store from 'store';



const service = new UserService()

// 变形为使用高阶装饰器 inject
// export default class Login extends React.Component {
//     render() {
//         return (
//             <_Login service={service} />
//         )
//     }
// }

@inject({ service })
@observer
export default class Login extends React.Component {

    handleClick(event) {
        event.preventDefault();
        let fm = event.target.form
        this.props.service.login(fm[0].value, fm[1].value)    // 异步提交
    }

    render() {
        console.log(this.props.service.loggedin)

        if (!store.get('token')) { // 判断是否已登录
            this.props.service.loggedin = false
        }

        // if (this.props.service.msg) {
        //     // 使用 antd 组件
        //     message.error(this.props.service.msg, 2, () => { this.props.service.msg = '' })
        // }

        if (this.props.service.loggedin) {
            console.log('you yes!!')
            return <Redirect to='/' />
        }

        console.log('login refesh ~~~~~~~~~~~~~~~')
        return (
            <div className="login-page">
                <div className="form">
                    <form className="login-form">
                        <input type="text" placeholder="邮箱" value='admin@monster.com' />
                        <input type="password" placeholder="密码" />
                        <button onClick={this.handleClick.bind(this)}>登录</button>
                        <p className="message">还未注册？<Link to='/reg'>注册账号 </Link></p>
                    </form>
                </div>
            </div>
        );
    }
}