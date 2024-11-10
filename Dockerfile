FROM node:latest
RUN npm config set registry https://registry.npm.taobao.org/
WORKDIR /app
COPY server /app

RUN npm i
RUN npm install pm2
EXPOSE 3000

CMD pm2 start /app/index.js