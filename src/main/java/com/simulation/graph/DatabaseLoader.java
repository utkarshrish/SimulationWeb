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
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"Green2015.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String green2015 = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"Yellow2015.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String yellow2015 = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"Red2015.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String red2015 = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"Red2016.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String red2016 = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"Yellow2016.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String yellow2016 = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"Green2016.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String green2016 = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"deduction.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String deductionScore = buf.toString();

//		buf = new StringBuffer();
//		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"marketShare.json"), "UTF-8"));
//		while ((str = br.readLine()) != null) {
//			buf.append(str);
//		}
//		String marketShare = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"makeDecisionForm.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String makeDecisionForm = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"explorerFilterFactor.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String explorerFilterFactor = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"reportsGraph.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String reportsGraph = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"explorer.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String explorer = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"marketShare.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String marketShare = buf.toString();

		buf = new StringBuffer();
		br = new BufferedReader(new InputStreamReader(DatabaseLoader.class.getResourceAsStream("/" +"reports.json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String reports = buf.toString();

//		this.repository.save(new Graph("operatingProfit", "simulationGraph", graphModel));
		this.repository.save(new Graph("graphTypes", "simulationGraph", graphType));
		this.repository.save(new Graph("revenue", "simulationGraph", revenue));
		this.repository.save(new Graph("weightage", "simulationGraph", weightage));
		this.repository.save(new Graph("deductions", "simulationGraph",  deductionScore));
		this.repository.save(new Graph("marketShare", "simulationGraph",  marketShare));
		this.repository.save(new Graph("makeDecisionForm", "simulationGraph", makeDecisionForm));
		this.repository.save(new Graph("explorerFilterFactor", "simulationGraph", explorerFilterFactor));
//		this.repository.save(new Graph("explorer", "simulationGraph", explorer));
//		this.repository.save(new Graph("reportsGraph", "simulationGraph", reportsGraph));
//		this.repository.save(new Graph("reports", "simulationGraph", reports));

//		Graph costYearlyInitial = new Graph("reports", "simulationGraph", "");
//		this.repository.save(costYearlyInitial);

//		this.inputRepository.save(new GraphInput("blue", "2015", blue2015));
//		this.inputRepository.save(new GraphInput("green2015", "2015", green2015));
//		this.inputRepository.save(new GraphInput("yellow2015", "2015", yellow2015));
//		this.inputRepository.save(new GraphInput("red2015", "2015", red2015));
//
//		this.inputRepository.save(new GraphInput("green2016", "2016", green2016));
//		this.inputRepository.save(new GraphInput("yellow2016", "2016", yellow2016));
//		this.inputRepository.save(new GraphInput("red2016", "2016", red2016));
//
//		this.inputRepository.save(new GraphInput("green2017", "2017", green2016));
//		this.inputRepository.save(new GraphInput("yellow2017", "2017", yellow2016));
//		this.inputRepository.save(new GraphInput("red2017", "2017", red2016));
//
//		this.inputRepository.save(new GraphInput("green2018", "2018", green2016));
//		this.inputRepository.save(new GraphInput("yellow2018", "2018", yellow2016));
//		this.inputRepository.save(new GraphInput("red2018", "2018", red2016));
//
//		this.inputRepository.save(new GraphInput("green2019", "2019", green2016));
//		this.inputRepository.save(new GraphInput("yellow2019", "2019", yellow2016));
//		this.inputRepository.save(new GraphInput("red2019", "2019", red2016));
	}
}