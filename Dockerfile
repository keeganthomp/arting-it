FROM node:8
WORKDIR /app
COPY . ./
ENV NODE_ENV=production
RUN npm install -g react-scripts
RUN npm install -g serve
RUN yarn
RUN yarn build
EXPOSE 3000
CMD serve -s build

# Stage 2 - the production environment
# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# RUN mkdir /etc/letsencrypt

# # COPY letsencrypt/live/www.tealeel.com/fullchain.pem /etc/letsencrypt

# # COPY letsencrypt/live/www.tealeel.com/privkey.pem /etc/letsencrypt
# EXPOSE 3000
# COPY --from=react-build /app/build /usr/share/nginx/html
