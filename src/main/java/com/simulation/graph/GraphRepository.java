package com.simulation.graph;

import com.simulation.graph.model.Graph;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GraphRepository extends MongoRepository<Graph, String> {}
