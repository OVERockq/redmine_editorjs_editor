#!/bin/bash

echo "Building Redmine Editor.js Plugin..."

echo "Installing dependencies..."
npm install

echo "Building for production..."
npm run build

echo "Build completed!" 