import axios from 'axios';
import store from 'store';
import { observable } from 'mobx';

store.addPlugin(require('store/plugins/expire')); // 加载过期插件

export default class PostService {
    constructor() {
        this.instance = axios.create({
            baseURL: '/api/post/'
        });
    }

    // 被观察者
    @observable done = false;
    @observable msg = '';
    @observable posts = [];       // 博文列表
    @observable pagination = { 'page': 1, 'size': 20, 'pages_count': 1, 'posts_count': 0 };  // 分页信息
    @observable post = {};        // 详情信息


    pub(title, content) {
        this.instance.post(  /* dev server 会代理 */
            'pub',
            { title, content },
            { headers: { 'jwt': store.get('token') } }  // 头信息也可以放在这里
        ).then(     // 如后端成功响应，开始处理 response
            response => {
                this.post_id = response.data.post_id;          // 获取文章 id
                this.msg = '文章提交成功';   // 修改被观察者
            }
        ).catch(    // 响应错误时会执行
            (error) => { this.msg = '文章提交失败'; }
        );
    };

    getall(search) {
        this.instance.get(
            'getall' + search
        ).then(     // 如后端成功响应，开始处理 response
            response => {
                // response.data 包括： posts:[post, post], pagination:{}
                this.posts = response.data.posts;
                this.pagination = response.data.pagination;   // 分页信息
            }
        ).catch(    // 响应错误时会执行
            (error) => { this.msg = '文章列表获取失败'; }
        );
    };

    getpage(id) {
        this.instance.get(
            id
        ).then(     // 如后端成功响应，开始处理 response
            response => {
                this.post = response.data.post     // 文章对象
            }
        ).catch(    // 响应错误时会执行
            (error) => { this.msg = '文章获取失败'; }
        );
    };
}