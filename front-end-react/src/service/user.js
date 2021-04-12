import axios from 'axios';
import store from 'store';
import { observable } from 'mobx'

store.addPlugin(require('store/plugins/expire')); // 加载过期插件

export default class UserService {

    // 被观察者
    @observable loggedin = false;
    @observable msg = '';

    login(email, passwd) {
        axios.post(
            '/api/user/login',      // 向后端 api 发起请求
            {
                'email': email,
                'passwd': passwd
            }
        ).then(     // 如后端成功响应，开始处理 response
            response => {   // 此函数要注意this的问题
                store.set('user', response.data.user);
                store.set('token', response.data.token, (new Date()).getTime() + (1000 * 60 * 60 * 8));   // 设置过期时间
                this.loggedin = true;   // 修改被观察者
            }
        ).catch(    // 响应错误时会执行
            (error) => { this.msg = '用户名或密码错误'; }
        );
    }

    reg(name, email, passwd) {
        axios.post(
            '/api/user/reg',      // 向后端 api 发起请求
            { name, email, passwd }
        ).then(     // 如后端成功响应，开始处理 response
            response => {
                store.set('user', response.data.user);
                store.set('token', response.data.token, (new Date()).getTime() + (3000));   // 设置过期时间
                this.loggedin = true;   // 修改被观察者
            }
        ).catch(    // 响应错误时会执行
            (error) => { this.msg = '用户名或密码错误'; }
        );
    }
}