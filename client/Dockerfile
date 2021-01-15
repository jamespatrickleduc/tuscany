FROM node:14
WORKDIR /client
COPY package.json ./
RUN NODE_ENV=development npm install
COPY . .
CMD ["npm", "run", "start"]