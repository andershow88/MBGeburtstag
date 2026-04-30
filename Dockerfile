FROM nginx:alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY . /usr/share/nginx/html
# Entrypoint-Skript: schreibt config.js aus $OPEN_AI_KEY beim Start
COPY 30-config-js.sh /docker-entrypoint.d/30-config-js.sh
RUN chmod +x /docker-entrypoint.d/30-config-js.sh \
 && rm -f /usr/share/nginx/html/30-config-js.sh \
 && rm -f /usr/share/nginx/html/Dockerfile
CMD ["nginx", "-g", "daemon off;"]
