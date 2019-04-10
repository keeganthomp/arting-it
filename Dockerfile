# Extending image
# FROM node:carbon

# RUN apt-get update
# RUN apt-get upgrade -y
# RUN apt-get -y install autoconf automake libtool nasm make pkg-config git apt-utils

# # Create app directory
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# # Versions
# RUN npm -v
# RUN node -v

# # Install app dependencies
# COPY package.json /usr/src/app/
# COPY package-lock.json /usr/src/app/


# RUN npm install

# # Bundle app source
# COPY . /usr/src/app

# # Port to listener
# EXPOSE 3000

# # Environment variables
# ENV NODE_ENV production
# ENV PORT 3000
# ENV PUBLIC_PATH "/"


# RUN npm run build

# RUN dir /usr/src/app
# RUN dir /usr/src/app/build
# Main command
# CMD [ "npm", "run", "start:server" ]

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
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

