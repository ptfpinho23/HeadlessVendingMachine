#!/bin/sh

export PROJECT_NAME="vending_machine_api"

#check if it running through the pipeline
export RUNNING_ENV;
if [ -z $ORIGIN ] 
then
    RUNNING_ENV="local";
fi

docker-compose -f ./docker/docker-compose.$RUNNING_ENV.yml -p $PROJECT_NAME pull;
docker-compose -f ./docker/docker-compose.$RUNNING_ENV.yml -p $PROJECT_NAME up $1;