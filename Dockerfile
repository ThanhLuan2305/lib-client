FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5172

CMD ["npm", "run", "dev", "--", "--host"]
