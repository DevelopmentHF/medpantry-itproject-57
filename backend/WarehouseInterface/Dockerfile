FROM azul/zulu-openjdk:17-latest
VOLUME /tmp
COPY ../build/libs/*.jar WarehouseInterface-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/WarehouseInterface-0.0.1-SNAPSHOT.jar"]