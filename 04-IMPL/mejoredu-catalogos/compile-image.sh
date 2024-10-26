#!/bin/sh
echo "Script executed from: ${PWD}"
BASEDIR=$(dirname $0)
# Execute: ./mvnw package -Dquarkus.package.type=legacy-jar
# From BASEDIR
./mvnw package -Dquarkus.package.type=legacy-jar
sudo docker build -f src/main/docker/Dockerfile.legacy-jar -t mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-catalogos:latest .
sudo docker push mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-catalogos:latest

# docker run --name=sipse-ms-catalogos -d --network sipse-app --network-alias sipse-ms-catalogos --add-host host.docker.internal:host-gateway -p 9001:9001 -e SIPSE_DB_DRIVE=postgresql -e SIPSE_DB_PORT=5432 -e SIPSE_DB_NAME=mejoreduDB -e SIPSE_DB_HOST=host.docker.internal -e SIPSE_DB_USER=admin -e SIPSE_DB_PASS=Mejoredu23# -e TZ=America/Mexico_City mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-catalogos:latest

# Reiniciar contenedor
docker pull mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-catalogos:latest && docker stop sipse-ms-catalogos && docker rm sipse-ms-catalogos && docker run --name=sipse-ms-catalogos -d --network sipse-app --network-alias sipse-ms-catalogos --add-host host.docker.internal:host-gateway -p 9001:9001 -e SIPSE_DB_DRIVE=postgresql -e SIPSE_DB_PORT=5432 -e SIPSE_DB_NAME=mejoreduDB -e SIPSE_DB_HOST=host.docker.internal -e SIPSE_DB_USER=admin -e SIPSE_DB_PASS=Mejoredu23# -e TZ=America/Mexico_City mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-catalogos:latest