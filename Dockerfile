FROM node:latest
RUN npm config set registry https://registry.npm.taobao.org/
WORKDIR /app
COPY server /app

RUN npm i
EXPOSE 3000

CMD node /app/express.js