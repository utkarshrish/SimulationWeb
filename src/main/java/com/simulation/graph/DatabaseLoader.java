package com.simulation.graph;

import com.simulation.graph.model.Graph;
import com.simulation.graph.model.GraphInput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Component
public class DatabaseLoader implements CommandLineRunner {

	private final GraphRepository repository;
	private final GraphInputRepository inputRepository;

	@Autowired
	public DatabaseLoader(GraphRepository repository, GraphInputRepository inputRepository) {
		this.repository = repository;
		this.inputRepository = inputRepository;
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

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"weightage.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String weightage = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"Blue2015.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String blue2015 = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"deduction.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String deductionScore = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"marketShare.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String marketShare = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"styleFactor.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String styleFactor = buf.toString();

		this.repository.save(new Graph("simulationGraph", "operating_profit", graphModel));
		this.repository.save(new Graph("simulationGraph", "graphTypes", graphType));
		this.repository.save(new Graph("simulationGraph", "revenue", revenue));
		this.repository.save(new Graph("simulationGraph", "weightage", weightage));
		this.repository.save(new Graph("simulationGraph", "deductions",  deductionScore));
		this.repository.save(new Graph("simulationGraph", "marketShare",  marketShare));
		this.repository.save(new Graph("simulationGraph", "styleFactor",  styleFactor));

		this.inputRepository.save(new GraphInput("blue", "2015", blue2015));
	}
}
// end::code[]