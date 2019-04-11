# build environment
FROM node:9.6.1 as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts@1.1.1 -g --silent
COPY . /usr/src/app
RUN npm run build

# production environment
FROM nginx:1.13.9-alpine
# RUN rm -rf /etc/nginx/conf.d

RUN mkdir /etc/letsencrypt

COPY letsencrypt/live/tealeel.com/fullchain.pem /etc/letsencrypt

COPY letsencrypt/live/tealeel.com/privkey.pem /etc/letsencrypt

# RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

