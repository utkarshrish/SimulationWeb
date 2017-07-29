/*
 * Copyright 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.simulation.graph;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * @author Greg Turnquist
 */
// tag::code[]
@Component
public class DatabaseLoader implements CommandLineRunner {

	private final GraphRepository repository;

	@Autowired
	public DatabaseLoader(GraphRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... strings) throws Exception {

		String str = "";
		StringBuffer buf = new StringBuffer();
		BufferedReader br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"strategic.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String graphModel = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"graphType.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String graphType = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"revenue.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String revenue = buf.toString();

		this.repository.save(new Graph("simulationGraph", "operating_profit", graphModel));
		this.repository.save(new Graph("simulationGraph", "graphTypes", graphType));
		this.repository.save(new Graph("simulationGraph", "revenue", revenue));
	}
}
// end::code[]