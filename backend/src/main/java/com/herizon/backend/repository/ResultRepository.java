package com.herizon.backend.repository;

import com.herizon.backend.model.Result;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ResultRepository extends MongoRepository<Result, String> {

    Optional<Result> findByUserId(String userId);

}