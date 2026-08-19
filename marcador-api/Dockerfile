FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
COPY target/marcador-api-0.0.1-SNAPSHOT.jar /app/marcador-api.jar
ENTRYPOINT ["java", "-jar", "marcador-api.jar"]
