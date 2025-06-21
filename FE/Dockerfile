FROM node:20-alpine

WORKDIR /app
COPY ./FE/package*.json ./
RUN npm install

COPY ./FE .
RUN npm run build

CMD ["npm", "run", "start"]