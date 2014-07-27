FROM node

MAINTAINER Sébastien Martin <seb.martin.94@gmail.com>

RUN npm update npm
RUN npm update

# Install Bower via npm
RUN npm install -g bower

# Install Grunt via npm
RUN npm install -g grunt

# Monte les sources de l'application
ADD src /usr/src/naf-ui
WORKDIR /usr/src/naf-ui

# Install project node dependencies (package.json)
RUN npm install

# TODO Exécuter Grunt
# RUN grunt

# En attendant le build automatisé avec Grunt ...
RUN rm -fr ./dist && mkdir ./dist && cp -frv ./app/* ./dist/

# application's default port
EXPOSE 80

# replace this with your main "server" script file
CMD [ "npm", "start" ]
