package com.herizon.backend.repository;

import com.herizon.backend.model.Result;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ResultRepository extends MongoRepository<Result, String> {
}