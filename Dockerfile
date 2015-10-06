FROM node:4.1.1
MAINTAINER psychowico <psychowico@gmail.com>

RUN npm install -g bower gulp

WORKDIR /app
