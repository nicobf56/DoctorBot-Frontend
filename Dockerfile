# Etapa 1: build de React
FROM node:18 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
