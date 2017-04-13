# 安风德早教平台

## 前言
安风德早教平台是一个致力于提高中小幼儿园、早教、托班管理和运营的互联网平台，以微信服务号作为终端，简单易用的早教学校管理平台。

早教平台QQ群: 313737544

<img width="180px" src="https://github.com/AnFengDe/afd_zaojiao/blob/master/doc/313737544.jpg?raw=true">
## 功能截屏
报名动图
<img width="640px" src="https://github.com/AnFengDe/afd_zaojiao/blob/master/doc/register.gif?raw=true">

## 功能截屏  接送动图 
<img width="640px" src="https://github.com/AnFengDe/afd_zaojiao/blob/master/doc/pickup.gif?raw=true">

作为早教学校，幼儿园经营者，你可以加入我们的托管平台，无须费心了解各种技术细节，零费用使用基础功能，完全满足一个小型幼儿园的需要，联系商务QQ了解详情。

## 部署步骤
有技术人员并愿意自己开发运营的幼儿园，可以参考以下部署步骤
1. 数据库部署
2. 部署前端
3. 部署业务服务器
4. 微信号配置

### 数据库部署

* 将tool文件夹中的 `ht_create.sql` 导入到本地的mysql数据库中,构建数据库；
* 创建数据库用户，并授权

```sql
create user 'username'@'hostname' indentified by 'password';

grant SELECT on ht.* to 'username'@'hostname';
grant INSERT on ht.* to 'username'@'hostname';
grant UPDATE on ht.* to 'username'@'hostname';
grant DELETE on ht.* to 'username'@'hostname';
grant INDEX on ht.* to 'username'@'hostname';
grant CREATE TEMPORARY TABLES on ht.* to 'username'@'hostname';
grant LOCK TABLES on ht.* to 'username'@'hostname';
```

### 前端部署
```shell
cd ht_front_end
npm installn
npm run build
```
将打包好的目录dist复制到指定的服务器上。
或者将package.json文件中的deploy指令中地址替换成服务器地址，如下所示
```shell
"deploy": "npm run build && scp -r dist/* afd@192.168.1.254:/incoming/afd_sync/www/",

#然后直接执行
npm run deploy
```
### 部署业务服务器
```shell
cd ht_school/htapi
npm install
```
在前端部署好的路径中创建htapi目录，将当前路径下的文件复制到服务器上，在服务器上运行
```shell
forever -w ./bin/www
```
为了保证业务服务器正常运行，位于config目录下的production.json配置文件根据实际情况进行配置

```javascript
db: {
    host: "DB_HOST",
    port: "DB_PORT",
    user: "DB_USER",
    password: "DB_PASSWORD",
    database: "DB_NAME",
    connectionLimit: 50
},
wx: {
    token: "WX_TOKEN",
    appid: "WX_APPID",
    secret: "WX_SECRET",
    encodingAESKey: "WX_AESKey"
},
blockchains: {
    enable: true,
    token: "井通商户账号",
    address: "企业钱包地址",
    secret: "企业钱包秘钥",
    key: "银关KEY",
    currency: "用户通编码",
    issuer: "银关编码"
},
```
## 参考链接
* [注册井通账号](http://www.jingtum.com/)
* [井通的接入流程文档](http://developer.jingtum.com/html/geting_started.html)
* [注册微信的公众平台账号](https://mp.weixin.qq.com)
