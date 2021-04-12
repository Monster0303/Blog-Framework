import React from 'react';
import ReactDom from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

import { Layout, Menu, Icon, ConfigProvider } from 'antd';  //ConfigProvider 全局配置组件，用于设置语言
import zhCN from 'antd/es/locale/zh_CN';  // 中文包

import Login from './component/login';    // 登录页
import Reg from './component/reg';        // 注册页
import Pub from './component/pub';        // 发布页
import Getall from './component/getall';  // 列表页
import Getpage from './component/getpage';        // 详情页

import 'antd/lib/layout/style';
import 'antd/lib/menu/style';
import 'antd/lib/icon/style';



const { Header, Content, Footer } = Layout; // 采用上中下布局


const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>
      <h1>博客项目</h1>
      <ul>
        <li>采用前后端分离开发模式</li>
        <li>前端使用最新的React技术，后端使用Django框架</li>
        <li>使用Restful风格设计服务间API接口</li>
        <li>无session认证技术，强密码技术</li>
        <li>阿里开源Antd组件</li>
        <li>企业级nginx + uWSGI + Django部署</li>
      </ul>
      <hr></hr>
    </h2>
  </div>
);


const App = () => (
  <Router>
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="home">
            <Icon type="home" />主页<Link to='/' />
          </Menu.Item>
          <Menu.Item key="login">
            <Icon type="login" />登录<Link to='/login' />
          </Menu.Item>
          <Menu.Item key="reg">
            <Icon type="user-add" />注册<Link to='/reg' />
          </Menu.Item>
          <Menu.Item key="getall">
            <Icon type="bars" />文章列表<Link to='/getall' />
          </Menu.Item>
          <Menu.Item key="pub">
            <Icon type="file-add" />发布<Link to='/pub' />
          </Menu.Item>
          <Menu.Item key="about">
            <Icon type="user" />关于<Link to='/about' />
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        {/* <div className="site-layout-content">这里显示 Centent</div> */}
        <Route path="/login" component={Login} />
        <Route path="/reg" component={Reg} />
        <Route path="/getall" component={Getall} />
        <Route path="/getpage/:id" component={Getpage} />
        <Route path="/pub" component={Pub} />
        <Route path="/about" component={About} />
        <Route exact path="/" component={Home} />
      </Content>
      <Footer style={{ textAlign: 'center' }}>吃什么都记不住 ©2018 Created by Monster</Footer>
    </Layout>
  </Router>
);

ReactDom.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);