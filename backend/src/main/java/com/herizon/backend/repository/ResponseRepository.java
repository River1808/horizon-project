package com.herizon.backend.repository;

import com.herizon.backend.model.Response;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ResponseRepository extends MongoRepository<Response, String> {

    Optional<Response> findByUserId(String userId);

}