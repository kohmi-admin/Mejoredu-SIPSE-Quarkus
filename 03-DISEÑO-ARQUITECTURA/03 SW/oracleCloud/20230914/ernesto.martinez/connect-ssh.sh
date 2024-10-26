#!/bin/sh

# Use the password for the private key in the ./Contraseña.txt file, the file content is:
# JREcJNu2Xs7reyDq4jZz
#
# Ip publica: 140.84.175.23

# Only read the first time using cat

if [ ! -f ./Contraseña.txt ]; then
    echo "File ./Contraseña.txt not found!"
    exit 1
fi

# Read the password from the file
password=$(cat ./Contraseña.txt)

# Extract the password from the file
password=$(echo $password | cut -d ' ' -f 1)

# Log the password
echo "Password: $password"

ssh-add ernesto.martinez.rsa
ssh -L 3306:10.1.1.122:3306 -N -f ernesto.martinez@140.84.175.23
