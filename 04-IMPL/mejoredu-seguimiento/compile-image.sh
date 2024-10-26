#!/bin/sh
echo "Script executed from: ${PWD}"
BASEDIR=$(dirname $0)
# Execute: ./mvnw package -Dquarkus.package.type=legacy-jar
# From BASEDIR
./mvnw package -Dquarkus.package.type=legacy-jar
sudo docker build -f src/main/docker/Dockerfile.legacy-jar -t mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-seguimiento-cors .
sudo docker push mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-seguimiento-cors

# docker run --name=sipse-ms-seguimiento -d --network sipse-app --network-alias sipse-ms-seguimiento --add-host host.docker.internal:host-gateway -p 9005:9005 -e SIPSE_DB_DRIVE=postgresql -e SIPSE_DB_PORT=5432 -e SIPSE_DB_NAME=mejoreduDB -e SIPSE_DB_HOST=host.docker.internal -e SIPSE_DB_USER=admin -e SIPSE_DB_PASS=Mejoredu23# -e SIPSE_ALF_UUID_SEGUIMIENTO=a21771fa-0bf2-4c87-a48d-c74057b1d762 -e SIPSE_ALF_ID_TOKEN=c2lwc2V1c2VyOnNpcHNlMjAyNGsw -e SIPSE_ALF_SERVER_URL=http://172.18.0.148:8080/alfresco/api/-default-/public/alfresco/versions/1 -e SIPSE_ALF_UUID_FIRMA=c73bd901-66b8-4bdd-896b-ee529ab8bde9 -e TZ=America/Mexico_City mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-seguimiento-cors:latest

# Reiniciar contenedor
# docker pull mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-seguimiento-cors && docker stop sipse-ms-seguimiento && docker rm sipse-ms-seguimiento && docker run --name=sipse-ms-seguimiento -d --network sipse-app --network-alias sipse-ms-seguimiento --add-host host.docker.internal:host-gateway -p 9005:9005 -e SIPSE_DB_DRIVE=postgresql -e SIPSE_DB_PORT=5432 -e SIPSE_DB_NAME=mejoreduDB -e SIPSE_DB_HOST=host.docker.internal -e SIPSE_DB_USER=admin -e SIPSE_DB_PASS=Mejoredu23# -e SIPSE_ALF_UUID_SEGUIMIENTO=a21771fa-0bf2-4c87-a48d-c74057b1d762 -e SIPSE_ALF_ID_TOKEN=c2lwc2V1c2VyOnNpcHNlMjAyNGsw -e SIPSE_ALF_SERVER_URL=http://172.18.0.148:8080/alfresco/api/-default-/public/alfresco/versions/1 -e SIPSE_ALF_UUID_FIRMA=c73bd901-66b8-4bdd-896b-ee529ab8bde9 -e TZ=America/Mexico_City mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-seguimiento-cors:latest