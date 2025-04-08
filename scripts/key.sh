#!/bin/bash

openssl genrsa -out private.pem 2048
openssl pkcs8 -topk8 -inform PEM -outform PEM -in private.pem -out private.key -nocrypt
openssl rsa -in private.pem -outform PEM -pubout -out public.pem

openssl req -new -key private.pem -out cert.csr -subj "/CN=client.chekt.com"
openssl x509 -req -in cert.csr -signkey private.pem -out public-cert.pem -days 3650
