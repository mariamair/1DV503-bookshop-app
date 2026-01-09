FROM node:24

WORKDIR /usr/src/bookstore

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]