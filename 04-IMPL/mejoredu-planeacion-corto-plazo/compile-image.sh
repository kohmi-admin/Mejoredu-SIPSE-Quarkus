#!/bin/sh
echo "Script executed from: ${PWD}"
BASEDIR=$(dirname $0)
# Execute: ./mvnw package -Dquarkus.package.type=legacy-jar
# From BASEDIR
./mvnw package -Dquarkus.package.type=legacy-jar
sudo docker build -f src/main/docker/Dockerfile.legacy-jar -t mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-planeacion-cp:v.0.0.4 .
sudo docker push mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-planeacion-cp:v.0.0.4

# docker run --name=sipse-ms-cp -d --network sipse-app --network-alias sipse-ms-cp --add-host host.docker.internal:host-gateway -p 9002:9002 -e SIPSE_DB_DRIVE=postgresql -e SIPSE_DB_PORT=5432 -e SIPSE_DB_NAME=mejoreduDB -e SIPSE_DB_HOST=host.docker.internal -e SIPSE_DB_USER=admin -e SIPSE_DB_PASS=Mejoredu23# -e SIPSE_ALF_UUID_PLANEACION=fbf0b143-2a69-4b9b-803d-d779d7bc241f -e SIPSE_ALF_ID_TOKEN=c2lwc2V1c2VyOnNpcHNlMjAyNGsw -e SIPSE_ALF_SERVER_URL=http://172.18.0.148:8080/alfresco/api/-default-/public/alfresco/versions/1 -e TZ=America/Mexico_City mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-planeacion-cp:v.0.0.4

# Reiniciar contenedor
# docker pull mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-planeacion-cp:v.0.0.4 && docker stop sipse-ms-cp && docker rm sipse-ms-cp && docker run --name=sipse-ms-cp -d --network sipse-app --network-alias sipse-ms-cp --add-host host.docker.internal:host-gateway -p 9002:9002 -e SIPSE_DB_DRIVE=postgresql -e SIPSE_DB_PORT=5432 -e SIPSE_DB_NAME=mejoreduDB -e SIPSE_DB_HOST=host.docker.internal -e SIPSE_DB_USER=admin -e SIPSE_DB_PASS=Mejoredu23# -e SIPSE_ALF_UUID_PLANEACION=fbf0b143-2a69-4b9b-803d-d779d7bc241f -e SIPSE_ALF_ID_TOKEN=c2lwc2V1c2VyOnNpcHNlMjAyNGsw -e SIPSE_ALF_SERVER_URL=http://172.18.0.148:8080/alfresco/api/-default-/public/alfresco/versions/1 -e TZ=America/Mexico_City mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-planeacion-cp:v.0.0.4