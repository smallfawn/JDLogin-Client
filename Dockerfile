FROM node:alpine
RUN npm config set registry https://registry.npm.taobao.org/
WORKDIR /app
COPY server /app

# 安装tzdata以便设置时区
RUN apk add --no-cache tzdata

RUN npm i
EXPOSE 3000

# 设置时区环境变量为Asia/Shanghai（北京时间）
ENV TZ=Asia/Shanghai

CMD node /app/express.js