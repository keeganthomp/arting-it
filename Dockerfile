FROM node:8 as tealeel-frontend
WORKDIR /app
COPY ./arting-it/ ./
ENV NODE_ENV=production
RUN ls
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY ./arting-it/nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir /etc/letsencrypt

ADD ./arting-it/letsencrypt/live/www.tealeel.com/fullchain.pem /etc/letsencrypt

ADD ./arting-it/letsencrypt/live/www.tealeel.com/privkey.pem /etc/letsencrypt

COPY --from=tealeel-frontend /app/build /usr/share/nginx/html
