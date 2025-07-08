FROM node:20-alpine

ARG NEXT_PUBLIC_BASE

ENV NEXT_PUBLIC_BASE=$NEXT_PUBLIC_BASE 

WORKDIR /app

COPY ./package*.json .
RUN npm install

COPY . .
RUN npm run build

# RUN npm run build 
CMD ["npm", "run", "start"]