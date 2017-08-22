package com.simulation.graph;

import com.auth0.SessionUtils;
import com.google.gson.Gson;
import com.nimbusds.jose.Payload;
import com.simulation.graph.model.Graph;
import com.simulation.graph.model.GraphInput;
import com.simulation.graph.service.GraphService;
import com.simulation.graph.service.ReportService;
import com.simulation.graph.service.SimulationService;
import com.nimbusds.jwt.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.SystemEnvironmentPropertySource;
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
		return "explorer";
	}

	@RequestMapping(value = "/makeDecision")
	public String makeDecision(final HttpServletRequest req, Map<String, Object> model) {

		final String idToken = (String) SessionUtils.get(req, "idToken");
		SignedJWT signedJWT;
		try {
			signedJWT = SignedJWT.parse(idToken);
			final Payload payload = signedJWT.getPayload();
			model.put("year", this.repository.findOne(payload.toJSONObject().get("sub").toString()).getModel());
		} catch (Exception e) {
			model.put("year", "2017");
		}

		return "makeDecision";
	}

	@RequestMapping(value = "/reports")
	public String reports() {
		return "reports";
	}

	@RequestMapping(value = "/dashboard")
	public String dashboard(final HttpServletRequest req, Map<String, Object> model) {
		String idToken = (String) SessionUtils.get(req, "idToken");
		SignedJWT signedJWT;
		try {
			signedJWT = SignedJWT.parse(idToken);
			final Payload payload = signedJWT.getPayload();
			model.put("year", Integer.valueOf(this.repository.findOne(payload.toJSONObject().get("sub").toString()).getModel())-1);
		} catch (Exception e) {
			model.put("year", "2016");
		}
		return "dashboard";
	}

	@RequestMapping(value = "/submitGraph", method = {RequestMethod.POST})
	@ResponseBody
	public ResponseEntity<Map> saveGraph(final HttpServletRequest req, @RequestBody Map graphInput) throws IOException {
		final String year = graphInput.get("year").toString();

		GraphInput blueGraphInput = new GraphInput("blue"+ year, year, graphInput.toString());
		this.inputRepository.save(blueGraphInput);

		Graph deductionGraph = repository.findOne("deductions");
		Graph weightageGraph = repository.findOne("weightage");

		simulationService.buildReports(graphInput , deductionGraph,weightageGraph, year);
		graphService.buildGraph();
		reportService.buildReportPage();

		String idToken = (String) SessionUtils.get(req, "idToken");
		SignedJWT signedJWT;
		try {
			signedJWT = SignedJWT.parse(idToken);
			final Payload payload = signedJWT.getPayload();
			this.repository.save(new Graph(payload.toJSONObject().get("sub").toString(), "simulationGraph", String.valueOf(Integer.valueOf(year)+1)));
		} catch (java.text.ParseException e) {

		}

		return new ResponseEntity("Successfully login", HttpStatus.OK);
	}
}