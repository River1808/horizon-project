package com.herizon.backend.repository;

import com.herizon.backend.model.QuestionnaireResult;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuestionnaireResultRepository extends MongoRepository<QuestionnaireResult, String> {
}