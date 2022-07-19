######

程序由 前端 VUE2.0 后端 node.js 写成
数据存储在 /project_server/configer 文件夹下的 json 文件里

##### 如何运行

环境 node npm

#### 后端

在 /project_server 文件夹下打开控制台 运行 npm insatll 或者 yarn
运行结束后 继续运行 node app.js
显示 3001 服务已启动.. 说明运行成功

#### 前端

在 /project_client 文件夹下打开控制台 运行 npm insatll 或者 yarn
运行结束后 继续运行 npm run dev
结束后 浏览器打开 http://localhost:8001/ 即可访问程序

##### BLOG-日志系统

系统分为管理员和普通用户
用户可在登录页面注册普通用户 管理员只有 admin 一个
系统自带管理员账号 N:admin P:admin

普通用户发表日志 必须由管理员审核通过,才能被其他用户看到,普通用户在日志审核通过之前,可以随意修改自己的日志,审核通过后,就没有修改和删除的权限,
管理员有所有用户日志的删除权限
审核通过后,用户可以有评论权限
日志系统首页 按照点击量排序,点击量前三的,会被加热

##### 现有账号

N:test P:test
N:pm P:admin
N:admin P:admin
