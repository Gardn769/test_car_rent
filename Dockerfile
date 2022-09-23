FROM node:18.7.0
WORKDIR /test-car-rental
COPY package*.json .
RUN npm i
COPY . .
CMD ["npm", "run", "start"]
