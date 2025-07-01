FROM node:20-alpine

ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL 

# 수정 (/app -> /FE)
WORKDIR /FE
COPY ./package*.json .
RUN npm install

COPY . .
# 필요없는 부분 제거
# RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
RUN npm run build

# RUN npm run build 
CMD ["npm", "run", "start"]