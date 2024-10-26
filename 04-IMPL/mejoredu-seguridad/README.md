# mejoredu-seguridad

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:
```shell script
./mvnw compile quarkus:dev
```

> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at http://localhost:8080/q/dev/.

## Packaging and running the application

The application can be packaged using:
```shell script
./mvnw package
```
It produces the `quarkus-run.jar` file in the `target/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/quarkus-app/lib/` directory.

The application is now runnable using `java -jar target/quarkus-app/quarkus-run.jar`.

If you want to build an _über-jar_, execute the following command:
```shell script
./mvnw package -Dquarkus.package.type=uber-jar
```

The application, packaged as an _über-jar_, is now runnable using `java -jar target/*-runner.jar`.

## Creating a native executable

You can create a native executable using: 
```shell script
./mvnw package -Pnative
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using: 
```shell script
./mvnw package -Pnative -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./target/mejoredu-seguridad-1.0.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult https://quarkus.io/guides/maven-tooling.

## Related Guides

- Hibernate ORM ([guide](https://quarkus.io/guides/hibernate-orm)): Define your persistent model with Hibernate ORM and Jakarta Persistence
- SmallRye OpenAPI ([guide](https://quarkus.io/guides/openapi-swaggerui)): Document your REST APIs with OpenAPI - comes with Swagger UI
- Quarkus Extension for Spring Web API ([guide](https://quarkus.io/guides/spring-web)): Use Spring Web annotations to create your REST services

## Provided Code

### Hibernate ORM

Create your first JPA entity

[Related guide section...](https://quarkus.io/guides/hibernate-orm)


## Configuración de VPN Mejor Edu, con la finalidad de conectar al LDAP
VPN MejorEdu

**1) Configurar cliente de VPN**

openVPN Connect
Para Win
https://openvpn.net/downloads/openvpn-connect-v3-windows.msi

**2) Cargar configurarción del usuarioVPN**

**3)Conectar con pass proporcionada de VPN**

**4)Probar url interna**
https://intranet.mejoredu.gob.mx/


## Configuración variables de entorno (ejemplo)
export LDAP_PRINCIPAL=spse@mejoredu.gob.mx
export LDAP_HOST=172.18.0.10:389
export LDAP_PASS=LDAP_PASS
export DB_HOST=localhost
export DB_USER=mejoredu_usr
export DB_PASS=DB_PASS


## Configuración Alfresco Content Services - Gestor de Archivos
Alfresco MejorEdu

**1) Descargar imagen y levantar Alfresco Community 7.0**
Ubicarse en la misma carpeta que contenga el archivo docker-alf7.0-compose.yml
Ejecutar en modo consola el comando *docker componse up*

**2) Validar que Alfresco esté levantado accediendo a la siguiente ruta:**
http://localhost:8080/alfresco

**3)  Configurar las variables de entorno para direccionar MS-Seguridad a Alfresco**
```
gestor.archivos.alfresco.uuidPlaneacion=${ALF_UUID_PLANEACION}
gestor.archivos.alfresco.uuidSeguimiento=${ALF_UUID_SEGUIMIENTO}
gestor.archivos.alfresco.uuidEvaluacion=${ALF_UUID_EVALUACION}
gestor.archivos.alfresco.uuidReportes=${ALF_UUID_REPORTES}
gestor.archivos.alfresco.uuidConfiguracion=${ALF_UUID_CONFIGURACION}
gestor.archivos.alfresco.idToken = ${ALF_ID_TOKEN}
gestor.archivos.alfresco.urlAlfresco = ${ALF_SERVER_URL}
```

### Spring Web

Spring, the Quarkus way! Start your RESTful Web Services with a Spring Controller.

[Related guide section...](https://quarkus.io/guides/spring-web#greetingcontroller)
