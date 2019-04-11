# build environment
FROM tiangolo/node-frontend as builder
# RUN mkdir /usr/src/app
# WORKDIR /usr/src/app
# ENV PATH /usr/src/app/node_modules/.bin:$PATH
# COPY package.json /usr/src/app/package.json
# RUN npm install --silent
# RUN npm install react-scripts@1.1.1 -g --silent
# COPY . /usr/src/app
# RUN npm run build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build

# production environment
# FROM nginx:1.13.9-alpine

# COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# RUN mkdir /etc/letsencrypt

# COPY letsencrypt/live/tealeel.com/fullchain.pem /etc/letsencrypt

# COPY letsencrypt/live/tealeel.com/privkey.pem /etc/letsencrypt

# COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
FROM nginx:1.15
COPY --from=builder /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=builder /nginx.conf /etc/nginx/conf.d/default.conf

