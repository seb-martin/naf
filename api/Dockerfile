FROM node

ADD src /usr/src/naf-api
WORKDIR /usr/src/naf-api

# install your application's dependencies
RUN npm install

# application's default port
EXPOSE 80

# replace this with your main "server" script file
CMD [ "npm", "start" ]
