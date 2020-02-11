#! /bin/sh

build_file="/workspace/"$BUILD_FILE

if [ ! -f ${build_file} ] ; then
    echo "File ${build_file} does not exist."
    exit 1
fi

for package in $(cat ${build_file} | jq -r '.[]'); do
    cd "/workspace/${package}"
    abuild checksum
    abuild -r
done