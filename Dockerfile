FROM nginx
# ADD default.conf /etc/nginx/conf.d/default.conf
RUN apk add nginx && \
    mkdir /run/nginx && \
    apk add nodejs && \
    apk add npm && \
    apk add bash && \
    cd /var/www/localhost/htdocs && \
    npm install && \
    npm run build && \
    apk del nodejs && \
    apk del npm && \
    mv /var/www/localhost/htdocs/build /usr/share/nginx/html