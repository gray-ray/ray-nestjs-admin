# 使用官方的 Node.js 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /home/ray/workspace

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
EXPOSE 3300

# 启动 NestJS 应用，使用 PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
