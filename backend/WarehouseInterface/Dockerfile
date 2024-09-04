# Stage 1: Build the application using Gradle
FROM gradle:7.6.0-jdk19 AS build
WORKDIR /app

# Copy Gradle build files
COPY build.gradle .
COPY settings.gradle .
COPY gradle gradle

# Copy the source code
COPY src src

# Build the application
RUN gradle build -x test

# Stage 2: Create the final Docker image using OpenJDK 19
FROM openjdk:19-jdk
WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8080
