#!/bin/bash

if [[ $# -eq 0 ]]
then
    echo Please usage like this:
    echo '    './ht_backup.sh host user db pass
    exit
fi

export HOST=$1
export USER=$2
export DB=$3
export PASS=$4

mysqldump $DB -h$HOST -u$USER -p$PASS > ht_backup.sql
