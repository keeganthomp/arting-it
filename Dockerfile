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

FROM node:8 as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

