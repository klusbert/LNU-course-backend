FROM node:14

# Create app directory
WORKDIR /usr/src/appo

FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ENV CONNECTION_STRING=**None** \
    MONGO_DATABASE_NAME=**None** \
    OPENVPN_PROVIDER=**None** \
    TOKEN_SECRET=true \
    MONGO_PW=/data/transmission-home \
    MONGO_USERNAME=9091 \
    MONGO_DATABASE=/data/completed 


EXPOSE 8080
CMD [ "node", "./src/server.js" ]