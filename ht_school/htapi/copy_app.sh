#!/bin/bash

if [[ $# -eq 0 ]]
then
    echo Please add copy destination, like this:
    echo '    './copy_app.sh afd@192.168.66.254:/incoming/afd_sync/htapi/ -node_modules
    exit
fi

#check copy node_modules or not
if [[ $2 == "-node_modules" ]]
then
    scp -r node_modules $1
fi

echo 需要考虑开发和产品环境配置的切换.....

scp -r app.js $1
scp -r .foreverignore $1
scp -r bin $1
scp -r config $1
scp -r common $1
scp -r package.json $1
scp -r routes $1
scp -r views $1
