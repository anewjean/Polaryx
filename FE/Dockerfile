FROM node:20-alpine

### 추가 ###
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
### 추가 ###

WORKDIR /FE
COPY ./package*.json .
RUN npm install

COPY . .
# 수정 (NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL 추가)
RUN npm run build

CMD ["npm", "run", "start"]