

FROM node:14-alpine3.14 as builder
WORKDIR /FrontEnd/app

# ENV
ENV PATH /FrontEnd/app/node_modules/.bin:$PATH
ENV REACT_APP_BASE_URL https://automationbackend.onrender.com

# Install app dependencies
COPY /FrontEnd/package*.json ./
RUN npm install --silent
COPY /FrontEnd ./
RUN npm run build

# production environment
FROM --platform=linux/amd64 nginx:stable-alpine
COPY --from=builder /FrontEnd/app/build /usr/share/nginx/html
COPY /FrontEnd/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]