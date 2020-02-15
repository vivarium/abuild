#! /bin/sh

. /etc/os-release

alpine=$ALPINE_VERSION

if [ ! $alpine == 'edge' ]; then
    alpine='v'$alpine
fi

export REPODEST="/repository/${alpine}"

if [ ! -d $REPODEST ]; then
    mkdir $REPODEST
fi

workspace="/workspace/${WORKDIR}"
cd $workspace

if [ ! -f "alpine.json" ] ; then
    echo "File ${workspace}/alpine.json does not exist."
    exit 1
fi

for package in $(cat alpine.json | jq -r '.[]'); do
    cd "${workspace}/${package}"
    abuild checksum
    abuild -r
done
