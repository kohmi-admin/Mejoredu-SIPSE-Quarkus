# MejorEdu - Implementación


##MicroServicios y orden de compilación bajo el comando maven:

**mvn clean install**

1. Modelos (https://github.com/kohmidev/MejorEdu-Quarkus/tree/master/04-IMPL/mejoredu-modelos)

**mvnw compile quarkus:dev**

2. Seguridad, Puerto 9000 (https://github.com/kohmidev/MejorEdu-Quarkus/tree/master/04-IMPL/mejoredu-seguridad)
3. Catálogos, Puerto 9001 (https://github.com/kohmidev/MejorEdu-Quarkus/tree/master/04-IMPL/mejoredu-catalogos)
4. Notificaciones
5. Planeador
6. Seguimiento
7. Evaluador
8. Reportes
9. Gestor de configuración
10. Portal Web Mejor Educación
11. Gestor de documentos, Puerto 8080 (Alfresco Content Service)
12. Firma Electrónica


##Los equipos de desarrollo serán ambientados con herramientas que permitan la optima adaptación de tecnologías del proyecto, en congunto con una metodología ágil minimizando lo posible los tiempos de construcción de la solución tecnologica MejorEdu. Dichas herramientas se listan a continuación:

1.	Instalar JDK 17
2.	Instalar IDE STS 4.0 con plugins Lombok (New Software Install paquete Lombox, url de descarga via STS4.0 https://projectlombok.org/p2)
3.	Instalar Maven 3.9.0
4.	Instalar Docker Desktop cargar imagen de mySql 8+ creando contenedor en puerto 3306 (Requiere Visual C++ 5+)
5.	Instalar Postman
6.	Instalar workBench MySql 8.0+
7.	Instalar github desktop
    https://desktop.github.com/
8.	Instalar LDAP Admin Tool 7.6


# Referencia a Dependencias de Quarkus

**Quarkus Extension for Spring Web API**
https://quarkus.io/guides/spring-web

**Hibernate ORM** 
https://quarkus.io/guides/hibernate-orm

**SmallRye OpenAPI**
https://quarkus.io/guides/openapi-swaggerui



# Levantar Base de datos contenerizada en Docker Desktop
>
>1) Instalar el Docker Desktop
>
>**Para windows**

>2) Descargar la imagen : docker pull mysql

>3) Crear y correr contenedor de mySql : ´docker run --name mejoredu-mysql -p 3306:3306 -v C:\respaldo\data\mysql\mejoredu:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=usr_mejoredu -d mysql´

>


# API Manager WSO2

>

>1) Una vez instalado el Docker Desktop

>2) Descargar la imagen : ´docker pull wso2/wso2am´

>

>*Para windows*

>3) Crear y correr contenedor de WSO2 : ´docker run -it -p 8280:8280 -p 8243:8243 -p 9443:9443 --name api-manager wso2/wso2am -v C:\respaldo\data\wso2\wso2carbon\4.0.0:/home/wso2carbon/wso2am-4.0.0´

>
**NOTA IMPORTANTE**
C:\respaldo\data\wso2\wso2carbon\4.0.0
Esta carpeta debe existir en nuestra maquina host antes de correr el comando 3


Versión
v4.0.0.4



**Accessing management console**
To access the Carbon Management Console, use the Docker host IP and port 9443 as follows:
>https://{DOCKER_HOST}:9443/carbon
To access the API Manager Publisher, use the Docker host IP and port 9443 as follows:
>https://{DOCKER_HOST}:9443/publisher
To access the API Manager Developer Portal, use the Docker host IP and port 9443 as follows:
>https://{DOCKER_HOST}:9443/devportal

