FROM node:13.12.0-alpine
WORKDIR /elpaso/frontend

COPY package.json package-lock.json ./
RUN npm install 
COPY . ./
EXPOSE 3000
CMD [ "npm", "start" ]