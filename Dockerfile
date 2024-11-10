#基于node

FROM node:latest

COPY server .

RUN cd server && npm i
RUN npm install -g pm2
EXPOSE 3000

CMD pm2 start server/index.js