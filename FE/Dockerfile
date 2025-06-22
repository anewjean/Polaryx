FROM node:20-alpine

### 추가 ###
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
### 추가 ###

# 수정 (/FE -> /app)
WORKDIR /app
COPY ./package*.json .
RUN npm install

COPY . .
# 수정 (NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL 추가)
RUN NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL npm run build
# RUN npm run build
CMD ["npm", "run", "start"]