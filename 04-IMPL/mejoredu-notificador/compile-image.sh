#!/bin/sh
echo "Script executed from: ${PWD}"
BASEDIR=$(dirname $0)
# Execute: ./mvnw package -Dquarkus.package.type=legacy-jar
# From BASEDIR
./mvnw package -Dquarkus.package.type=legacy-jar
sudo docker build -f src/main/docker/Dockerfile.legacy-jar -t mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-notificador:latest .
sudo docker push mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-notificador:latest

# docker run --name=sipse-ms-notificador -d --network sipse-app --network-alias sipse-ms-notificador --add-host host.docker.internal:host-gateway -p 9009:9009 -e SIPSE_DB_HOST=host.docker.internal -e SIPSE_DB_USER=admin -e SIPSE_DB_PASS=Mejoredu23# -e TZ=America/Mexico_City mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-notificador:latest

# Reiniciar contenedor
# docker pull mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-notificador:latest && docker stop sipse-ms-notificador && docker rm sipse-ms-notificador && docker run --name=sipse-ms-notificador -d --network sipse-app --network-alias sipse-ms-notificador --add-host host.docker.internal:host-gateway -p 9009:9009 -e SIPSE_DB_HOST=host.docker.internal -e SIPSE_DB_USER=admin -e SIPSE_DB_PASS=Mejoredu23# -e TZ=America/Mexico_City mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-notificador:latest