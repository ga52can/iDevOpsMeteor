### Main repository for iDevops project


##### Building
1. In order to get started, make sure you have the following tools installed and running on your OS:
    1. Yarn or NPM (node)
    2. Meteor

2. To start simply run the following command
    `$ meteor reset && yarn install && yarn start`
    this should clear the db of meteor to avoid any issues, install all dependencies defined in package.json and start a local meteor server at localhost:3000

3. Make sure that the services are instrumented and that docker-compose of each service has the environment variables defined in [docker-compose.yml](https://gitlab.lrz.de/idevops/zipkin/blob/master/docker-compose/docker-compose.services.yml).

4. Run the custom zipkin server in [zipkin](https://gitlab.lrz.de/ge68hin/idev-ops-zipkin) & make sure that zipkin [docker-compose.yml](https://gitlab.lrz.de/ge68hin/idev-ops-zipkin/blob/master/src/main/resources/application.yml) has the correct address of the meteor server.


#### How it works

1. On the server start, there is a method that is triggered every 60 second which simply calls DockerApi of each environment (IPs of environments are instrumented and sent as part of the Zipkin spans).
2. Calls to DockerAPI retrieve environment info that are saved in mongodb.
3. On zipkin side, with each new span received, 3 endpoints are called which exist behind Meteor API, these are
    a. /spans. used to send spans from zipkin
    b. /services. used to send detected services from zipkin.
    c. /dependencies. used to send dependencies between services detected by zipkin.
4. Data manipulation, processing and any calculations are done using Meteor and rendered using React.



##### Development
For development, fixures are available inside `server/fixures`, these are only loaded in development mode. (These fixures represent a snapshot of a production database).


#### Architecture
##### How it all fits together

1. Each instrumented service that's running, sends spans to a zipkin server. Each span has custom data associated with it that's reported be each service. Responsibility of filling out this data lies on the deployer of the service (either automatically or manually). These data include the following:
    1. *Environment name*, *image name* (which corresponds to the version of the deployment), *container name*.
    2. IP of the environment (if docker-compose is used with its current configuration the reported IP of the environment will always be the local one on the network that docker creates among services) [docker-compose.yml](https://gitlab.lrz.de/idevops/zipkin/blob/master/docker-compose/docker-compose.services.yml).
2. On receiving any new spans the zipkin server sends **spans**, **services**, **dependencies** to a defined address which is set in the [configuration.yml](https://gitlab.lrz.de/ge68hin/idev-ops-zipkin/blob/master/src/main/resources/application.yml), the environment variables defined in there can be passed down via [docker-compose.yml](https://gitlab.lrz.de/ge68hin/idev-ops-zipkin/blob/master/docker-compose.yml).
3. Received IPs, that point to each environment, are used to call DockerApi periodically (each 60 seconds) to fetch stats about the containers.
