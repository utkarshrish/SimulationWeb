package com.simulation.graph.model;

import org.springframework.data.annotation.Id;

public class Graph {

	private @Id String type;
	private String name;
	private String model;

	public Graph() {}

	public Graph(String name, String type, String model) {
		this.name = name;
		this.type = type;
		this.model = model;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}
}