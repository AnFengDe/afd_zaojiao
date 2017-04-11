#!/bin/bash

if [[ $# -eq 0 ]]
then
    echo Please usage like this:
    echo '    './export_db_struct.sh host user db pass
    exit
fi

export HOST=$1
export USER=$2
export DB=$3
export PASS=$4

echo "USE ht;" > ht_create.sql
mysqldump --opt -h $HOST -d $DB -u $USER -p$PASS >> ht_create.sql
