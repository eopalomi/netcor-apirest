FROM node:10

RUN mkdir -p /usr/src/netcor-api

WORKDIR /usr/src/netcor-api

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]