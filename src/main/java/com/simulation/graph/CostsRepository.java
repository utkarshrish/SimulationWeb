package com.simulation.graph;

import com.simulation.graph.model.Cost;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CostsRepository extends MongoRepository<Cost, String> {}
