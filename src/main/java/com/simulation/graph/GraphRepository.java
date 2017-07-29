package com.simulation.graph;

import org.springframework.data.mongodb.repository.MongoRepository;

// tag::code[]
public interface GraphRepository extends MongoRepository<Graph, String> {

}
// end::code[]
