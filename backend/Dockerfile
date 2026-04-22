# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create a lightweight JRE image for runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Set timezone to Asia/Ho_Chi_Minh
ENV TZ=Asia/Ho_Chi_Minh
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime && \
    echo "Asia/Ho_Chi_Minh" > /etc/timezone

# Add postgresql-client for backup functionality and create app data directories
USER root
RUN apk add --no-cache postgresql-client && \
    addgroup -S spring && adduser -S spring -G spring && \
    mkdir -p /app/data/backups /app/data/logs && \
    chown -R spring:spring /app/data

USER spring:spring

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application with optimized memory, garbage collector, and timezone
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-XX:+UseG1GC", "-Duser.timezone=Asia/Ho_Chi_Minh", "-jar", "app.jar"]
