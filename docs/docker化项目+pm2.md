步骤 1: 安装 PM2
首先，在项目中安装 PM2：

sh
复制代码
npm install pm2 --save
步骤 2: 创建 PM2 配置文件
在项目根目录下创建一个 ecosystem.config.js 文件，以配置 PM2：

javascript
复制代码
module.exports = {
  apps: [
    {
      name: 'nestjs-app',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
在这个配置文件中：

name 是应用名称。
script 是应用入口文件（NestJS 编译后的 main.js 文件）。
instances 设置为 max 以使用所有可用的 CPU 内核。
exec_mode 设置为 cluster 以启用集群模式。
env 和 env_production 用于设置环境变量。
步骤 3: 修改 Dockerfile
将 PM2 集成到 Dockerfile 中：

dockerfile
复制代码
# 使用官方的 Node.js 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖，包括 PM2
RUN npm install

# 复制当前目录下所有文件到工作目录
COPY . .

# 构建 NestJS 项目
RUN npm run build

# 全局安装 PM2
RUN npm install pm2 -g

# 设置环境变量
ENV NODE_ENV=production

# 暴露应用运行的端口
EXPOSE 3000

# 启动 NestJS 应用，使用 PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
步骤 4: 更新 docker-compose.yml 文件
更新 docker-compose.yml 文件，以使用新的 Dockerfile 配置：

yaml
复制代码
version: '3'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: test
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  nestjs-app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    environment:
      - NODE_ENV=production
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules

volumes:
  mysql-data:
步骤 5: 构建和运行 Docker 容器
在项目根目录下运行以下命令来构建 Docker 镜像并启动 Docker 容器：

sh
复制代码
docker-compose up --build -d
步骤 6: 访问应用
确保服务器防火墙规则允许访问端口 3000，然后通过浏览器访问 http://localhost:3000，你应该能看到 NestJS 应用在运行。

使用 PM2 管理应用
PM2 提供了一些实用的命令来管理应用：

查看运行的应用：

sh
复制代码
pm2 ls
查看应用日志：

sh
复制代码
pm2 logs
重新启动应用：

sh
复制代码
pm2 restart nestjs-app
停止应用：

sh
复制代码
pm2 stop nestjs-app
删除应用：

sh
复制代码
pm2 delete nestjs-app