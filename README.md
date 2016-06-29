## 使用node http post上传文件

## 步骤
1. 上传机器和接收机器一般在同一局域网
2. 进入接收服务器
3. clone项目 `$ git clone https://github.com/glenzhang/http-push.git`
4. `$ cd http-push && npm install`
5. 启动 `npm http-push-receiver.js [3004]` 3004为开启端口，可选，默认为3001
6. 进入上传服务器
7. clone项目 `$ git clone https://github.com/glenzhang/http-push.git`
8. `$ cd http-push && npm install`
9. 上传文件`node http-push-sever.js -r http://127.0.0.1:3001 -f D:\http-push\dist -t D:\http-push\upload\dist` -r, 接收服务器, -f 待传路径, -t 接收路径。 
	> window 环境下 http://127.0.0.1:3001， D:\http-push\dist，D:\http-push\upload\dist  不带引号
	
	> Linux  环境下 'http://127.0.0.1:3001'，'D:\http-push\dist'，'D:\http-push\upload\dist' 带引号
	
![http-push](http://www.qianduanbiji.com/assets/http-push.jpg)

