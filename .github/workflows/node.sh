#!/bin/sh

set -e

# Install
yarn install

# Depcheck
yarn depcheck

# Lint
yarn prettier

# Doc
yarn doc

# Tests
yarn test

# Build
yarn build
