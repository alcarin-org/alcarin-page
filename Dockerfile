FROM dockerfile/nodejs-bower-gulp-runtime
MAINTAINER psychowico <psychowico@gmail.com>

RUN npm install -g coffee-script nodemon npm-css

WORKDIR /app
