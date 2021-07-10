#!/bin/bash

cp ./relaunch.sh $SRC
cd $SRC
chmod 740 ./relaunch.sh

if [[ ! -f .next/build-manifest.json ]]
then
		unzip -o build-latest.zip
fi

ls build-latest.zip | entr -nr ./relaunch.sh
