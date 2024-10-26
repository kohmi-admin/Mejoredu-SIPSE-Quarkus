mvn package -DskipTests -Dquarkus.package.type=legacy-jar
docker image rm mejoredu-sipse/ms-catalogos-legacy-jar
docker build -f src/main/docker/Dockerfile.legacy-jar -t mejoredu-sipse/ms-catalogos-legacy-jar .

docker run -i --name sipse-ms-catalogos -p 9001:9001 --env SIPSE_DB_HOST=172.17.0.2 --env SIPSE_DB_USER=root --env SIPSE_DB_PASS=usr_mejoredu mejoredu-sipse/ms-catalogos-legacy-jar



