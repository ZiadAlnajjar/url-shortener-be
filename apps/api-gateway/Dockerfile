FROM node:20

WORKDIR /usr/app

COPY dist/ .

COPY .env .env.shared .

RUN npm install

CMD ["node", "main"]
