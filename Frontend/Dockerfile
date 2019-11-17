FROM alpine:3

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update 
RUN apk upgrade
RUN apk add --update npm
RUN apk add nodejs
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]