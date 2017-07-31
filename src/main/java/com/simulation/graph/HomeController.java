package com.simulation.graph;

import com.simulation.graph.model.Cost;
import com.simulation.graph.model.Graph;
import com.simulation.graph.model.GraphInput;
import com.simulation.graph.model.UserInput;
import com.simulation.graph.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.util.HashMap;

@Controller
public class HomeController {

	@Autowired
	private GraphService graphService;

	@Autowired
	private GraphRepository repository;

	@Autowired
	private GraphInputRepository inputRepository;

	@Autowired
	CostsRepository costsRepository;

	@RequestMapping(value = "/results")
	public String index() {
		return "index";
	}

	@RequestMapping(value = "/makeDecision")
	public String makeDecision() {
		return "makeDecision";
	}

	@RequestMapping(value = "/reports")
	public String reports() {
		return "reports";
	}

	@RequestMapping(value = "/abc", method = RequestMethod.GET)
	public ResponseEntity<?> getUser(HttpServletRequest request) {
		HashMap composition = new HashMap();
		composition.put("abc", "abc");
		return new ResponseEntity(composition, HttpStatus.OK);
	}

	@RequestMapping(value = "/submitGraph", method = {RequestMethod.POST})
	@ResponseBody
	public ResponseEntity<UserInput> saveGraph(@RequestBody UserInput graphInput) throws IOException {
		GraphInput blue2015GraphInput = inputRepository.findOne("blue");

		Graph marketShareGraph = repository.findOne("marketShare");
		Graph deductionGraph = repository.findOne("deductions");
		Graph weightageGraph = repository.findOne("weightage");
		Graph styleFactorGraph = repository.findOne("styleFactor");

		Cost blueCosts2015 = graphService.calculateOperatingProfit(blue2015GraphInput,marketShareGraph,deductionGraph,weightageGraph,styleFactorGraph);
		costsRepository.save(blueCosts2015);
		return new ResponseEntity("Successfully login", HttpStatus.OK);
	}

	private Graph createGraph(String type, String year) throws IOException {
		String str = "";
		StringBuffer buf = new StringBuffer();
		BufferedReader br = new BufferedReader(new InputStreamReader(HomeController.class.getResourceAsStream("/" + type +".json"), "UTF-8"));
		while ((str = br.readLine()) != null) {
			buf.append(str);
		}
		String blue2015 = buf.toString();
		return new Graph(type, year , blue2015);
	}
}