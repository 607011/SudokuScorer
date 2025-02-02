#!/bin/sh

source .env

DIST=dist

cp -r index.html js css ${DIST}
echo Minifying ...
minify ${DIST}/index.html -o ${DIST}/index.html
minify ${DIST}/js/app.js -o ${DIST}/js/app.js
# echo Optimizing images ...
# optipng -quiet -o7 ${DIST}/images/*.png
echo Syncing to ${DST} ...
cd ${DIST}
rsync --exclude '.DS_Store' -Rrav . ${DST}
