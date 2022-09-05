# Install dependencies only when needed
FROM node:16.15-alpine
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /nextjs

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

ENV PORT 2006

EXPOSE 2006


RUN yarn build 

CMD ["yarn", "start"]


