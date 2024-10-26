#Seguridad
mvn package -DskipTests -Dquarkus.package.type=legacy-jar
docker image rm mejoredu-sipse/ms-seguridad-legacy-jar

docker build -f src/main/docker/Dockerfile.legacy-jar -t mejoredu-sipse/ms-seguridad-legacy-jar .
#docker build -f src/main/docker/Dockerfile.legacy-jar -t mx-queretaro-1.ocir.io/axd4fuzohfaf/mejoredu-sipse-seguridad .

docker run -i --name sipse-ms-seguridad -p 9000:9000 --env SIPSE_DB_HOST=172.17.0.3 --env SIPSE_DB_USER=root --env SIPSE_DB_PASS=usr_mejoredu --env SIPSE_LDAP_HOST=ldap://172.17.0.5 --env SIPSE_LDAP_PASS=bGRhcE0zajByM2R1  --env SIPSE_ALF_SERVER_URL=http://192.168.0.127:8080/alfresco/api/-default-/public/alfresco/versions/1 --env SIPSE_LDAP_PRINCIPAL=cn=admin,dc=mejoredu,dc=org --env SIPSE_ALF_ID_TOKEN=dXNyX2FsZl9tZWpvcmVkdTp1c3JfYWxmX21lam9yZWR1 --env SIPSE_ALF_UUID_CONFIGURACION=3a6b2c11-b5eb-4002-ad0b-a95cf53befc6 --env SIPSE_ALF_UUID_REPORTES=d1124608-47f7-45e0-8a8f-27dd71d28dd5 --env SIPSE_ALF_UUID_EVALUACION=4096092d-196c-4d74-9af5-0f6b4f1bdd09 --env SIPSE_ALF_UUID_SEGUIMIENTO=b0a27464-ef64-4108-aa31-edae4a6d64e9 --env SIPSE_ALF_UUID_PLANEACION=855ac75a-67cd-4d10-8c2d-3c1878d4a6c3 mejoredu-sipse/ms-seguridad-legacy-jar