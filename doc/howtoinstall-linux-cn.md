
#### 系统的参数可以参考：[app setting](app-setting.md), 环境变量可以写到pm2.json里

1. 安装nodejs 7.60+, 推荐用最新LTS版本（8.9）， 并更新npm到最新`npm install npm -g`

2. 安装`mysql 5.7+` ，设置用户名 `root` 密码 `hitchhiker888` 

3. 进入mysql， 创建db: `hitchhiker-prod`，修改变量`max_allowed_packet=200M`
> 创建DB: CREATE DATABASE IF NOT EXISTS \`hitchhiker-prod\` default charset utf8 COLLATE utf8_general_ci;
> 修改变量需要把`max_allowed_packet=200M`加到 /my.conf 文件[mysqld] Section下，具体参考：[change max_allowed_packet](https://stackoverflow.com/questions/8062496/how-to-change-max-allowed-packet-size)

4. 下载 linux_deploy.sh[https://raw.githubusercontent.com/brookshi/Hitchhiker/release/deploy/linux_deploy.sh](https://raw.githubusercontent.com/brookshi/Hitchhiker/release/deploy/linux_deploy.sh)

5. 编辑`linux_deploy.sh`，修改第一行的`myhost`变量值为你的ip加端口，格式：`http://ip:port/`，如果是用BSD/OSX系统，记得把 `sed -i "s#myhost#$myhost#g" pm2.json` 替换成 `sed -i '' "s#myhost#$myhost#g" pm2.json`

6. 运行命令`source ./linux_deploy.sh`安装

7. 完成，在浏览器访问`ip:port`测试
