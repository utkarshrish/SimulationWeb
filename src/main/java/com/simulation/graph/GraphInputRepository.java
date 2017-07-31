package com.simulation.graph;

import com.simulation.graph.model.GraphInput;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GraphInputRepository extends MongoRepository<GraphInput, String> {}
