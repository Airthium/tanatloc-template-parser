#!/bin/bash

# Build
yarn build

# Templates
for template in ../tanatloc/templates/*.edp.ejs; do
    echo " -> Beautify $template"
    node ./lib/index.js "$template" "$template"
done

# Blobs
for blob in ../tanatloc/templates/blobs/**/*.edp.ejs; do
    echo " -> Beautify $blob"
    node ./lib/index.js "$blob" "$blob"
done

# Airthium plugins
for template in ../tanatloc/plugins/airthium/template/*.edp.ejs; do
    echo " -> Beautify $template"
    node ./lib/index.js "$template" "$template"
done
