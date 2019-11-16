FROM node:12.13-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm install graphql express-graphql
RUN npm install lodash
COPY . .
EXPOSE 4000
CMD npm start