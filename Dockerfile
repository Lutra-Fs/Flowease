FROM node:17.1.0

WORKDIR /usr/src/app

RUN apt-get update || : && apt-get install python -y
RUN apt-get install ffmpeg -y

COPY package*.json ./

RUN npm ci

COPY . .

CMD [ "node", "index.js" ]