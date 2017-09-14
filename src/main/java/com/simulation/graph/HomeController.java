package com.simulation.graph;

import com.auth0.SessionUtils;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.nimbusds.jose.Payload;
import com.simulation.graph.model.Graph;
import com.simulation.graph.model.GraphInput;
import com.simulation.graph.model.UserInput;
import com.simulation.graph.service.GraphService;
import com.simulation.graph.service.ReportService;
import com.simulation.graph.service.SimulationService;
import com.nimbusds.jwt.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
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

	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	final static Gson gson = new Gson();

	@RequestMapping(value = "/explorer")
	public String index(final HttpServletRequest req, Map<String, Object> model) {
		final String idToken = (String) SessionUtils.get(req, "idToken");
		SignedJWT signedJWT;
		final Payload payload;
		try {
			signedJWT = SignedJWT.parse(idToken);
			payload = signedJWT.getPayload();
			String userId = payload.toJSONObject().get("sub").toString();
			int year = 2018;
			if(this.repository.findOne(payload.toJSONObject().get("sub").toString()) != null){
				year = Integer.valueOf(this.repository.findOne(userId).getModel());
			}
			model.put("user", userId + "_" + year);
		}
		catch (ParseException e){
			logger.info("parsing exception");
		}
		return "explorer";
	}

	@RequestMapping(value = "/makeDecision")
	public String makeDecision(final HttpServletRequest req, Map<String, Object> model) {

		final String idToken = (String) SessionUtils.get(req, "idToken");
		SignedJWT signedJWT;
		try {
			signedJWT = SignedJWT.parse(idToken);
			final Payload payload = signedJWT.getPayload();
			model.put("user", Integer.valueOf(this.repository.findOne(payload.toJSONObject().get("sub").toString()).getModel())+1);
		} catch (Exception e) {
			model.put("user", "2019");
		}

		return "makeDecision";
	}

	@RequestMapping(value = "/reports")
	public String reports(final HttpServletRequest req, Map<String, Object> model) {
		final String idToken = (String) SessionUtils.get(req, "idToken");
		SignedJWT signedJWT;
		final Payload payload;
		try {
			signedJWT = SignedJWT.parse(idToken);
			payload = signedJWT.getPayload();
			String userId = payload.toJSONObject().get("sub").toString();
			int year = 2018;
			if(this.repository.findOne(payload.toJSONObject().get("sub").toString()) != null){
				year = Integer.valueOf(this.repository.findOne(userId).getModel());
			}
			model.put("user", userId + "_" + year);
		}
		catch (ParseException e){
			logger.info("parsing exception");
		}
		return "reports";
	}

	@RequestMapping(value = "/decisionHistory")
	public String decisionHistory(final HttpServletRequest req, Map<String, Object> model) {
		final String idToken = (String) SessionUtils.get(req, "idToken");
		SignedJWT signedJWT;
		final Payload payload;
		try {
			signedJWT = SignedJWT.parse(idToken);
			payload = signedJWT.getPayload();
			String userId = payload.toJSONObject().get("sub").toString();
			int year = 2018;
			if(this.repository.findOne(payload.toJSONObject().get("sub").toString()) != null){
				year = Integer.valueOf(this.repository.findOne(userId).getModel());
			}
			model.put("user", userId + "_" + year);
		}
		catch (ParseException e){
			logger.info("parsing exception");
		}
		return "decisionHistory";
	}

	@RequestMapping(value = "/dashboard")
	public String dashboard(final HttpServletRequest req, Map<String, Object> model) throws IOException {
		String idToken = (String) SessionUtils.get(req, "idToken");
		SignedJWT signedJWT;
		final Payload payload;
		try {
			signedJWT = SignedJWT.parse(idToken);
			payload = signedJWT.getPayload();
			String userId = payload.toJSONObject().get("sub").toString();
			int year;
			if(this.repository.findOne(userId) != null){
				year = Integer.valueOf(this.repository.findOne(userId).getModel());
			} else{
				year = 2018;
				initializeUser(userId);
				this.repository.save(new Graph(userId, "simulationGraph", "2018"));
				GraphInput blue2015 = putGraph("blue", 2015);
				GraphInput blue2016 = putGraph("blue", 2016);
				GraphInput blue2017 = putGraph("blue", 2017);
				GraphInput blue2018 = putGraph("blue", 2018);
				this.inputRepository.save(blue2015);
				this.inputRepository.save(blue2016);
				this.inputRepository.save(blue2017);
				this.inputRepository.save(blue2018);

				final Graph deductionGraph = repository.findOne("deductions");
				final Graph weightageGraph = repository.findOne("weightage");
				simulationService.buildReports(userId, blue2015.getUserInput() , deductionGraph, weightageGraph, "2015");
				graphService.buildGraph(userId);
				reportService.buildReportPage(userId);
				simulationService.buildReports(userId, blue2016.getUserInput() , deductionGraph, weightageGraph, "2016");
				graphService.buildGraph(userId);
				reportService.buildReportPage(userId);
				simulationService.buildReports(userId, blue2017.getUserInput() , deductionGraph, weightageGraph, "2017");
				graphService.buildGraph(userId);
				reportService.buildReportPage(userId);
				simulationService.buildReports(userId, blue2018.getUserInput() , deductionGraph, weightageGraph, "2018");
				graphService.buildGraph(userId);
				reportService.buildReportPage(userId);
			}
			model.put("user", userId + "_" + year);
		}
		catch (ParseException e){
			logger.info("parsing exception");
		}

		return "dashboard";
	}

	@RequestMapping(value = "/submitGraph", method = {RequestMethod.POST})
	public String saveGraph(final HttpServletRequest req, @RequestBody Map graphInput) throws IOException {
		String idToken = (String) SessionUtils.get(req, "idToken");
		SignedJWT signedJWT;
		try {
			signedJWT = SignedJWT.parse(idToken);
			final String year = graphInput.get("year").toString();
			final Payload payload = signedJWT.getPayload();
			final String userId = payload.toJSONObject().get("sub").toString();
			this.repository.save(new Graph(userId, "simulationGraph", String.valueOf(Integer.valueOf(year))));

			final List<UserInput> userInputs = new ArrayList<>();
			GraphInput graphInputs = this.inputRepository.findOne(userId);
			if(graphInputs != null){
				userInputs.addAll(gson.fromJson(graphInputs.getUserInput()
						, new TypeToken<List<UserInput>>(){}.getType()));
			}
			userInputs.add(GraphUtil.buildGraphInput(graphInput));

			GraphInput blueGraphInput = new GraphInput(userId, year, gson.toJson(userInputs));
			this.inputRepository.save(blueGraphInput);

			Graph deductionGraph = repository.findOne("deductions");
			Graph weightageGraph = repository.findOne("weightage");

			simulationService.buildReports(userId, graphInput , deductionGraph,weightageGraph, year);
			graphService.buildGraph(userId);
			reportService.buildReportPage(userId);
		} catch (java.text.ParseException e) {
			logger.info("parsing exception");
		}

//		return new ResponseEntity("Successfully login", HttpStatus.OK);
//		String redirectUri = req.getScheme() + "://" + req.getServerName()  + "/dashboard";
		return "";
	}

	private void initializeUser(String userId) throws IOException {
		for(int year = 2015; year< 2023; year++){
			this.inputRepository.save(putGraph("green", year));
			this.inputRepository.save(putGraph("red", year));
			this.inputRepository.save(putGraph("yellow", year));
		}
		this.repository.save(putGraph("/marketShare", userId + "_marketShare", "simulationGraph"));
//		this.repository.save(putGraph("explorer", userId + "_explorer", "simulationGraph"));
//		this.repository.save(putGraph("reportsGraph", userId + "_reportsGraph", "simulationGraph"));
//		this.repository.save(putGraph("reports", userId + "_reports", "simulationGraph"));
	}

	private GraphInput putGraph(String product, int year){
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
			logger.info("parsing exception");
		}
		String yearS = String.valueOf(year);
		return new GraphInput(product + yearS, yearS, buf.toString());
	}

	private Graph putGraph(String graphPath, String type, String name){
		StringBuffer buf = new StringBuffer();
		String str;
		BufferedReader br = null;
		try{
			br = new BufferedReader(new InputStreamReader(HomeController.class.getResourceAsStream(graphPath +".json"), "UTF-8"));
			while ((str = br.readLine()) != null) {
				buf.append(str);
			}
		} catch (IOException e){
			logger.info("parsing exception");
		}
		return new Graph(type, name, buf.toString());
	}

	@RequestMapping(value = "/deleteUser", method = RequestMethod.GET)
	public String deleteUser(final HttpServletRequest req) {

		final String idToken = (String) SessionUtils.get(req, "idToken");
		SignedJWT signedJWT;
		try {
			signedJWT = SignedJWT.parse(idToken);
			final Payload payload = signedJWT.getPayload();
			String userId = payload.toJSONObject().get("sub").toString();

			this.inputRepository.delete(userId);

			this.repository.delete(userId);
			this.repository.delete(userId + "_marketShare");
			this.repository.delete(userId + "_reports");
			this.repository.delete(userId + "_reportsGraph");
			this.repository.delete(userId + "_explorer");

		} catch (Exception e) {
			logger.info("parsing exception");
		}

		return "redirect:" + req.getContextPath() + "/login";
	}
}