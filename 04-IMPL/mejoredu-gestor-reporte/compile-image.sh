#!/bin/sh
echo "Script executed from: ${PWD}"
BASEDIR=$(dirname $0)
# Execute: ./mvnw package -Dquarkus.package.type=legacy-jar
# From BASEDIR
./mvnw package -Dquarkus.package.type=legacy-jar
sudo docker build -f src/main/docker/Dockerfile.legacy-jar -t mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-reportes .
sudo docker push mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-reportes

# docker run --name=sipse-ms-reportes -d --network sipse-app --network-alias sipse-ms-reportes --add-host host.docker.internal:host-gateway -p 9010:9010 -e SIPSE_DB_DRIVE=postgresql -e SIPSE_DB_PORT=5432 -e SIPSE_DB_NAME=mejoreduDB -e SIPSE_DB_HOST=host.docker.internal -e SIPSE_DB_USER=admin -e SIPSE_DB_PASS=Mejoredu23# -e TZ=America/Mexico_City mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-reportes:latest

# Reiniciar contenedor
# docker pull mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-reportes && docker stop sipse-ms-reportes && docker rm sipse-ms-reportes && docker run --name=sipse-ms-reportes -d --network sipse-app --network-alias sipse-ms-reportes --add-host host.docker.internal:host-gateway -p 9010:9010 -e SIPSE_DB_DRIVE=postgresql -e SIPSE_DB_PORT=5432 -e SIPSE_DB_NAME=mejoreduDB -e SIPSE_DB_HOST=host.docker.internal -e SIPSE_DB_USER=admin -e SIPSE_DB_PASS=Mejoredu23# -e TZ=America/Mexico_City mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-reportes:latest