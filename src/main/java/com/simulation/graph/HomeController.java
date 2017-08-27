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
import java.text.ParseException;
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
		final Payload payload;
		try {
			signedJWT = SignedJWT.parse(idToken);
			payload = signedJWT.getPayload();
			if(this.repository.findOne(payload.toJSONObject().get("sub").toString()) != null){
				model.put("year", Integer.valueOf(this.repository.findOne(payload.toJSONObject().get("sub").toString()).getModel())-1);
			} else{
				this.inputRepository.save(putGraph("green", "2015"));
				this.inputRepository.save(putGraph("green", "2016"));
				this.inputRepository.save(putGraph("green", "2017"));
				this.inputRepository.save(putGraph("green", "2018"));
				this.inputRepository.save(putGraph("green", "2019"));
				this.inputRepository.save(putGraph("green", "2020"));
				this.inputRepository.save(putGraph("green", "2021"));
				this.inputRepository.save(putGraph("green", "2022"));

				this.inputRepository.save(putGraph("red", "2015"));
				this.inputRepository.save(putGraph("red", "2016"));
				this.inputRepository.save(putGraph("red", "2017"));
				this.inputRepository.save(putGraph("red", "2018"));
				this.inputRepository.save(putGraph("red", "2019"));
				this.inputRepository.save(putGraph("red", "2020"));
				this.inputRepository.save(putGraph("red", "2021"));
				this.inputRepository.save(putGraph("red", "2022"));

				this.inputRepository.save(putGraph("yellow", "2015"));
				this.inputRepository.save(putGraph("yellow", "2016"));
				this.inputRepository.save(putGraph("yellow", "2017"));
				this.inputRepository.save(putGraph("yellow", "2018"));
				this.inputRepository.save(putGraph("yellow", "2019"));
				this.inputRepository.save(putGraph("yellow", "2020"));
				this.inputRepository.save(putGraph("yellow", "2021"));
				this.inputRepository.save(putGraph("yellow", "2022"));

				GraphInput blue2015 = putGraph("blue", "2015");
				GraphInput blue2016 = putGraph("blue", "2016");
				GraphInput blue2017 = putGraph("blue", "2017");
				GraphInput blue2018 = putGraph("blue", "2018");
				this.inputRepository.save(blue2015);
				this.inputRepository.save(blue2016);
				this.inputRepository.save(blue2017);
				this.inputRepository.save(blue2018);

				this.repository.save(new Graph(payload.toJSONObject().get("sub").toString(), "simulationGraph", "2018"));
				model.put("year", "2018");

				final Graph deductionGraph = repository.findOne("deductions");
				final Graph weightageGraph = repository.findOne("weightage");
				simulationService.buildReports(blue2015.getUserInput() , deductionGraph, weightageGraph, "2015");
				graphService.buildGraph();
				reportService.buildReportPage();
				simulationService.buildReports(blue2015.getUserInput() , deductionGraph, weightageGraph, "2016");
				graphService.buildGraph();
				reportService.buildReportPage();
				simulationService.buildReports(blue2015.getUserInput() , deductionGraph, weightageGraph, "2017");
				graphService.buildGraph();
				reportService.buildReportPage();
				simulationService.buildReports(blue2015.getUserInput() , deductionGraph, weightageGraph, "2018");
				graphService.buildGraph();
				reportService.buildReportPage();
			}
		}
		catch (ParseException e){
			model.put("year", "2016");
		}

		return "dashboard";
	}

	@RequestMapping(value = "/submitGraph", method = {RequestMethod.POST})
	@ResponseBody
	public String saveGraph(final HttpServletRequest req, @RequestBody Map graphInput) throws IOException {
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

//		return new ResponseEntity("Successfully login", HttpStatus.OK);
		String redirectUri = req.getScheme() + "://" + req.getServerName()  + "/dashboard";
		return "redirect:" + redirectUri;
	}

	private GraphInput putGraph(String product, String year){
		StringBuffer buf = new StringBuffer();
		String str;
		BufferedReader br = null;
		try{
			br = new BufferedReader(new InputStreamReader(HomeController.class.getResourceAsStream(
					"/initialData/"+ product + "/"+ product + year +".json"), "UTF-8"));
			while ((str = br.readLine()) != null) {
				buf.append(str);
			}
		} catch (IOException e){

		} finally {
			try {
				br.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return new GraphInput(product + year, year, buf.toString());
	}
}