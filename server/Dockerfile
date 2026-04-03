FROM node:alpine

# Adds basic shell tools often needed for migrations/scripts
RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]