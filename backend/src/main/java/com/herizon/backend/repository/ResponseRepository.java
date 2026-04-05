package com.herizon.backend.repository;

import com.herizon.backend.model.Response;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ResponseRepository extends MongoRepository<Response, String> {
}