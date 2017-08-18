package com.simulation.graph;

import com.auth0.SessionUtils;
import com.google.gson.Gson;
import com.simulation.graph.model.Graph;
import com.simulation.graph.model.GraphInput;
import com.simulation.graph.service.GraphService;
import com.simulation.graph.service.ReportService;
import com.simulation.graph.service.SimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.util.Map;

@Controller
public class HomeController {

	@Autowired
	private SimulationService simulationService;

	@Autowired
	private GraphService graphService;

	@Autowired
	private GraphRepository repository;

	@Autowired
	private ReportService reportService;

	@Autowired
	private GraphInputRepository inputRepository;

	@RequestMapping(value = "/explorer")
	public String index(final HttpServletRequest req) {
		String accessToken = (String) SessionUtils.get(req, "accessToken");
		String idToken = (String) SessionUtils.get(req, "idToken");

		System.out.println(accessToken + "\n" + idToken);
		return "explorer";
	}

	@RequestMapping(value = "/makeDecision")
	public String makeDecision(final HttpServletRequest req) {
		String accessToken = (String) SessionUtils.get(req, "accessToken");
		String idToken = (String) SessionUtils.get(req, "idToken");
		System.out.println(accessToken + "\n" + idToken);

		return "makeDecision";
	}

	@RequestMapping(value = "/reports")
	public String reports() {
		return "reports";
	}

	@RequestMapping(value = "/submitGraph", method = {RequestMethod.POST})
	@ResponseBody
	public ResponseEntity<Map> saveGraph(@RequestBody Map graphInput) throws IOException {
		final String year = graphInput.get("year").toString();

		GraphInput blueGraphInput = new GraphInput("blue"+ year, year, graphInput.toString());
		this.inputRepository.save(blueGraphInput);

		Graph deductionGraph = repository.findOne("deductions");
		Graph weightageGraph = repository.findOne("weightage");

		simulationService.buildReports(graphInput , deductionGraph,weightageGraph, year);
		graphService.buildGraph();
		reportService.buildReportPage();

		return new ResponseEntity("Successfully login", HttpStatus.OK);
	}
}