FROM node:24

WORKDIR /usr/src/bookstore

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["npm", "start"]