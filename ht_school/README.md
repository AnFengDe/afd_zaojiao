# 德瑞园学校后端

## 开发环境部署
* 安装nvm
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
```
* 安装nodejs
```
nvm install 6.9.5
```
* 安装模块
```
npm install
npm install -g mocha
npm install -g forever
npm install should
```

## 开发调试
* 本地运行服务
```
export NODE_ENV=development && forever -w bin/www
```
这样一旦程序文件发生变化会自动重启服务器
* 单元测试
```
make test
```
* 发布到测试服务器
```
./copy_app.sh afd@192.168.66.254:/incoming/afd_sync/htapi/
```
