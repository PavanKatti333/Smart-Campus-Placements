# ===================================================
# Multi-stage Dockerfile for Smart Campus Placement Backend
# Target Runtime: Java 23 (Eclipse Temurin)
# ===================================================

# Stage 1: Build the application
FROM maven:3.9.9-eclipse-temurin-23 AS build
WORKDIR /app

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build application artifact
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE image
FROM eclipse-temurin:23-jre
WORKDIR /app

# Create non-root application user
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

# Copy built executable JAR
COPY --from=build /app/target/*.jar app.jar

# Cloud providers inject $PORT dynamically (default: 8083)
EXPOSE 8083
ENV PORT=8083

# Launch with dynamic port binding and memory optimizations
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8083} -jar app.jar"]
