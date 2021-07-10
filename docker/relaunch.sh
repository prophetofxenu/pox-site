#!/bin/bash

sleep 3

rm -rf node_modules
unzip -o build-latest.zip

npm install
npm start
