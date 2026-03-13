FROM openjdk:27-ea-jdk

COPY target/billing-service.jar billing-service.jar

EXPOSE 4001
EXPOSE 9001

ENTRYPOINT ["java", "-jar", "/billing-service.jar"]

