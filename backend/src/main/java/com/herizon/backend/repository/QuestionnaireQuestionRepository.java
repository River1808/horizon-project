package com.herizon.backend.repository;

import com.herizon.backend.model.QuestionnaireQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuestionnaireQuestionRepository extends MongoRepository<QuestionnaireQuestion, String> {
}