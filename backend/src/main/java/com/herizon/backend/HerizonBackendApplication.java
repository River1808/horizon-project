package com.herizon.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;   

@SpringBootApplication
@EnableMongoAuditing   
public class HerizonBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HerizonBackendApplication.class, args);
    }
}