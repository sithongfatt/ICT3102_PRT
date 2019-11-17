FROM alpine:3
RUN apk update 
RUN apk upgrade
RUN apk add --update npm
RUN apk add nodejs
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "start" ]