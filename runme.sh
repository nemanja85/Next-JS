#!/bin/sh

DIR="keys"

if [ ! -d $DIR ]; then
    mkdir keys
    openssl genrsa -out $DIR/private.pem 4096
    openssl rsa -in $DIR/private.pem -outform PEM -pubout -out $DIR/public.pem
fi
