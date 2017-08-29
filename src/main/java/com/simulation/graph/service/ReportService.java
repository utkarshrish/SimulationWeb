package com.simulation.graph.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.simulation.graph.GraphRepository;
import com.simulation.graph.GraphUtil;
import com.simulation.graph.model.Graph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {
    final static Gson gson = new Gson();

    final static List<String> GRAPH_LEGENDS;
    static {
        GRAPH_LEGENDS = new ArrayList<>();
        GRAPH_LEGENDS.add("revenue");
        GRAPH_LEGENDS.add("variableCost");
        GRAPH_LEGENDS.add("fixedCost");
        GRAPH_LEGENDS.add("otherCost");
        GRAPH_LEGENDS.add("totalCost");
        GRAPH_LEGENDS.add("operatingProfit");
        GRAPH_LEGENDS.add("cumulativeOperatingProfit");
    }

    final static List<String> PRODUCTION_LEGENDS;
    static {
        PRODUCTION_LEGENDS = new ArrayList<>();
        PRODUCTION_LEGENDS.add("productionInputUnits");
        PRODUCTION_LEGENDS.add("maxProductionUnitsDemand");
        PRODUCTION_LEGENDS.add("inventory");
    }

    @Autowired
    private GraphRepository repository;

    private String buildGraphLegend(Map<String, BigDecimal> blueReportsStored, String graphLegend){
        BigDecimal graphLegendValue = blueReportsStored.get(graphLegend);
        String unit = GraphUtil.buildUnit(graphLegendValue);
        return GraphUtil.PRICE_FORMAT.format(GraphUtil.buildPointRepresentation(graphLegendValue, unit));
    }

    private String buildGraphLegendWithUnit(Map<String, BigDecimal> blueReportsStored, String graphLegend){
        BigDecimal graphLegendValue = blueReportsStored.get(graphLegend);
        String unit = GraphUtil.buildUnit(graphLegendValue);
        return GraphUtil.PRICE_FORMAT.format(GraphUtil.buildPointRepresentation(graphLegendValue, unit)) + unit;
    }

    public void buildReportPage(String userId){
        Graph reports = repository.findOne(userId + "_reports");
        Map<String, Map<String, Map<String, BigDecimal>>> reportsStored = gson.fromJson(reports.getModel()
                , new TypeToken<Map<String,Map<String, Map<String, BigDecimal>>>>(){}.getType());

        final Map<String, Map<String, String>> incomeStatements = new HashMap<>();
        BigDecimal cumulativeProfit = new BigDecimal("0.0");
        for(String year: reportsStored.keySet().stream().sorted().collect(Collectors.toList())){
            Map<String, BigDecimal> blueReportsStored = reportsStored.get(year).get("blue");

            Map<String, String> incomeStatement = new HashMap<>();
            for(String graphLegend: GRAPH_LEGENDS){
                if(graphLegend.equalsIgnoreCase("cumulativeOperatingProfit")){
                    cumulativeProfit = cumulativeProfit.add(blueReportsStored.get(graphLegend));
                    String unit = GraphUtil.buildUnit(cumulativeProfit);
                    incomeStatement.put(graphLegend, GraphUtil.PRICE_FORMAT.format(GraphUtil.buildPointRepresentation(cumulativeProfit, unit)) + unit);
                } else {
                    incomeStatement.put(graphLegend, buildGraphLegendWithUnit(blueReportsStored, graphLegend));
                }
            }
            incomeStatements.put(year, incomeStatement);
        }

        List<Map<String, Object>> graphDataProductList = new ArrayList<>();
        Map<String, Object> productDataMap;
        List<String> yearList = GraphUtil.getYearList(reportsStored);

        for(String productionLegend: PRODUCTION_LEGENDS) {
            productDataMap = new HashMap<>();
            List<Map<String, String>> dataMapList = new ArrayList<>();
            for(String year: yearList) {
                Map<String, String> dataMap = new HashMap<>();
                dataMap.put("x", year);
                dataMap.put("y", buildGraphLegend(reportsStored.get(year).get("blue"), productionLegend));
                dataMapList.add(dataMap);
            }
            productDataMap.put("data", dataMapList);
            productDataMap.put("type", productionLegend);
            graphDataProductList.add(productDataMap);
        }

        Graph explorer = repository.findOne(userId + "_explorer");
        Map<String, Object> explorerGraph = gson.fromJson(explorer.getModel(), new TypeToken<Map<String,Object>>(){}.getType());

        Map<String, Object> reportsGraph = new HashMap<>();
        reportsGraph.put("width", 600);
        reportsGraph.put("height", 375);
        reportsGraph.put("graphTransformAxisX", 33);
        reportsGraph.put("graphTransformAxisY", 6);
        reportsGraph.put("xAxis", GraphUtil.createXAxis());
        reportsGraph.put("unitPriceYAxis", GraphUtil.createYAxis(0, 100, ""));
        reportsGraph.put("productionYAxis", GraphUtil.createYAxis(0, 100, "M"));
        reportsGraph.put("incomeStatement", incomeStatements);
        reportsGraph.put("unitPrice", explorerGraph.get("unitPrice"));
        reportsGraph.put("production", graphDataProductList);

        Graph explorerGraphUpdated = new Graph(userId +"_reportsGraph", "simulationGraph", gson.toJson(reportsGraph));
        this.repository.save(explorerGraphUpdated);
    }
}

