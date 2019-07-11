rm -rf ./release
meteor build --directory ./release
#docker build -t meteor4idevops --build-arg http_proxy=http://172.17.0.1:33333 --build-arg https_proxy=http://172.17.0.1:33333 .
docker build -t meteor4idevops .
