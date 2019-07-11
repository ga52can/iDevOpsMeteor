#RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
FROM johnnyutahio/meteor-launchpad:latest
#FROM meteor4idevops:base
#FROM johnnyutahio/meteor-launchpad:devbuild
#ADD release/idevops.tar.gz /opt/meteor/dist/
#ADD release/bundle/programs/server/app/app.js /opt/meteor/dist/bundle/programs/server/app/
#ADD release/ /opt/meteor/dist/
