#!/bin/bash

echo "Creating migrations"
sleep 5
cp --recursive /elpaso/api/migrations/. /elpaso/buffer_migrations
