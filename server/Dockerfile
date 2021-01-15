FROM node:14
WORKDIR /server
COPY package.json ./
RUN npm install
COPY . .
RUN npm i -g esm
CMD ["npm", "run", "serve"]