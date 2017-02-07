FROM node:slim

# Install packages
RUN npm install -g ember-cli
RUN npm install -g bower
RUN apt-get update && apt-get install git -y

# Create Application Directory
ENV WORKING_DIRECTORY /usr/share/unfetter-discover-ui
RUN mkdir -p $WORKING_DIRECTORY
WORKDIR $WORKING_DIRECTORY

# Install Dependencies
COPY package.json $WORKING_DIRECTORY
COPY bower.json $WORKING_DIRECTORY
RUN npm install
RUN bower install --allow-root
COPY . $WORKING_DIRECTORY

# Start Application
EXPOSE 4200 50000
CMD [ "ember", "server", "--live-reload-port", "50000" ]
