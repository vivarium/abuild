#! /bin/sh

build_file="/workspace/"$BUILD_FILE

for package in $(cat ${build_file} | jq -r '.[]'); do
    cd "/workspace/${package}"
    abuild checksum
    abuild -r
done