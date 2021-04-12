# Blog-Framework

博客前后端分离框架

多人使用的博客系统。采用 BS 架构实现。

- 支持用户管理：注册、增删改查用户
- 支持博文管理：增删改查博文

# 架构

- 前端 React，后端 Django，通过 axios 前后端分离；
- 使用 Mobx 异步状态管理；
- 以 MVC 模型分层开发；
- 前端 UI 使用阿里开源的 Antd 组件；
- 通过 JWT 实现无 session 认证；使用 bcrypt 强密码技术；
- 服务间使用 Restful 风格的 API 接口；
- 使用 MySQL Workbench 建模设计；
- 前后端联调使用 Postman，调试打包使用 webpack；
- 所有服务均在 Docker 内部署。

# 部署

[博客网站打包部署](https://monster0303.gitee.io/posts/6edb2101/#四、博客网站打包部署)