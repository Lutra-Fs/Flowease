FROM node:18.12.1

WORKDIR /usr/src/app

RUN apt-get update || : && apt-get install python -y
RUN apt-get install ffmpeg -y

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "node",  "index.js" ]