FROM node:slim

# Install packages
RUN npm install -g ember-cli; npm install -g bower; apt-get update && apt-get install git -y; ; find / -name "cb-never*.tgz" -delete

# Create Application Directory
ENV WORKING_DIRECTORY /usr/share/unfetter-discover-ui
RUN mkdir -p $WORKING_DIRECTORY
WORKDIR $WORKING_DIRECTORY

# Install Dependencies
COPY package.json $WORKING_DIRECTORY
COPY bower.json $WORKING_DIRECTORY

# The NPM package depends on TAR package, which has a test directory with an encrypted tgz file, that gets blocked by some antivirus scanners. Removing it.
RUN npm install; find / -name "cb-never*.tgz" -delete
RUN bower install --allow-root; find / -name "cb-never*.tgz" -delete
COPY . $WORKING_DIRECTORY

# Start Application
EXPOSE 4200 50000
CMD [ "ember", "server", "--live-reload-port", "50000" ]
