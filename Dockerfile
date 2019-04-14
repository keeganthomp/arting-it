FROM node:8 as tealeel-frontend
WORKDIR /app
COPY . ./
ENV NODE_ENV=production
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir /etc/letsencrypt

ADD ./letsencrypt/live/www.tealeel.com/fullchain.pem /etc/letsencrypt

ADD ./letsencrypt/live/www.tealeel.com/privkey.pem /etc/letsencrypt

RUN ls /etc
EXPOSE 3000
COPY --from=tealeel-frontend /app/build /usr/share/nginx/html
