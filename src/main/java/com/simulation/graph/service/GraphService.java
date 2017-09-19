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

@Service
public class GraphService {

    final static Gson gson = new Gson();

    final static List<String> GRAPH_LEGENDS;
    final static List<String> NON_USER_GRAPH_LEGENDS;
    static {
        GRAPH_LEGENDS = new ArrayList<>();
        GRAPH_LEGENDS.add("operatingProfit");
        GRAPH_LEGENDS.add("revenue");
        GRAPH_LEGENDS.add("actualDemand");
        GRAPH_LEGENDS.add("marketShare");
        GRAPH_LEGENDS.add("inventory");
        GRAPH_LEGENDS.add("productionInputUnits");
        GRAPH_LEGENDS.add("unitPrice");
    }
    static {
        NON_USER_GRAPH_LEGENDS = new ArrayList<>();
        NON_USER_GRAPH_LEGENDS.add("brandAttributeDemand");
        NON_USER_GRAPH_LEGENDS.add("formulationDemand");
        NON_USER_GRAPH_LEGENDS.add("households");
        NON_USER_GRAPH_LEGENDS.add("mediaConsumed");
        NON_USER_GRAPH_LEGENDS.add("pricePointDemand");
        NON_USER_GRAPH_LEGENDS.add("tradeChannelDemand");
    }

    @Autowired
    private GraphRepository repository;

    public void buildGraph(String userId){
        final Graph reportsGraph = repository.findOne(userId + "_reports");
        final Map<String,Map<String, Map<String, BigDecimal>>> reportsStored = gson.fromJson(reportsGraph.getModel(),
                new TypeToken<Map<String,Map<String, Map<String, BigDecimal>>>>(){}.getType());

        Map<String, Object> explorerGraph = new HashMap<>();
        explorerGraph.put("width", 660);
        explorerGraph.put("height", 375);
        explorerGraph.put("graphTransformAxisX", 33);
        explorerGraph.put("graphTransformAxisY", 6);
        explorerGraph.put("xAxis", GraphUtil.createXAxis());
        explorerGraph.put("marketShareYAxis", GraphUtil.createYAxis(0, 100, "%"));
        explorerGraph.put("operatingProfitYAxis", GraphUtil.createYAxis(-150, 200, "M"));
        explorerGraph.put("unitPriceYAxis", GraphUtil.createYAxis(-150, 200, "in $US"));

        for(String graphLegend: GRAPH_LEGENDS){
            final List<Map<String, Object>> graphData = createGraphData(reportsStored, graphLegend);
            explorerGraph.put(graphLegend, graphData);

            if(!graphLegend.equalsIgnoreCase("marketShare") && !graphLegend.equalsIgnoreCase("operatingProfit")
                    && !graphLegend.equalsIgnoreCase("unitPriceYAxis")){
                Map<String, Object> yAxis = createYAxis(reportsStored, graphLegend);
                explorerGraph.put(graphLegend+"YAxis", yAxis);
            }
        }

        NON_USER_GRAPH_LEGENDS.forEach(graphLegend -> {
            if(!explorerGraph.containsKey(graphLegend)){
                final Graph nonUserExplorerGraph = repository.findOne(graphLegend);
                final Map<String, Object> nonUserGraphData = gson.fromJson(nonUserExplorerGraph.getModel(),
                        new TypeToken<Map<String, Object>>(){}.getType());
                explorerGraph.put(graphLegend, nonUserGraphData.get(graphLegend));
                explorerGraph.put(graphLegend + "YAxis", nonUserGraphData.get(graphLegend + "YAxis"));
            }
        });

        Graph explorerGraphUpdated = new Graph(userId + "_explorer", "simulationGraph", gson.toJson(explorerGraph));
        this.repository.save(explorerGraphUpdated);
    }

    private List<Map<String, Object>> createGraphData(Map<String, Map<String, Map<String, BigDecimal>>> reportsStored, String type){
        List<Map<String, Object>> graphDataProductList = new ArrayList<>();
        Map<String, Object> productDataMap;
        List<Double> costYearList = new ArrayList<>();
        List<String> yearList = GraphUtil.getYearList(reportsStored);
        for(String product : GraphUtil.PRODUCT_LIST) {
            productDataMap = new HashMap<>();
            List<Map<String, String>> dataMapList = new ArrayList<>();
            final String unit = GraphUtil.buildUnit(reportsStored.get(yearList.get(0)).get(product).get(type));

            for(String xTick: yearList) {
                Map<String, String> dataMap = new HashMap<>();
                dataMap.put("x", xTick);
                Double yTick = GraphUtil.buildPointRepresentation(reportsStored.get(xTick).get(product).get(type), unit);
                costYearList.add(yTick);
                dataMap.put("y", GraphUtil.PRICE_FORMAT.format(yTick));
                dataMapList.add(dataMap);
            }
            productDataMap.put("data", dataMapList);
            productDataMap.put("type", product);
            graphDataProductList.add(productDataMap);
        }
        return graphDataProductList;
    }

    private Map<String, Object> createYAxis(Map<String, Map<String, Map<String, BigDecimal>>> reportsStored, String type){
        List<Double> costYearList = new ArrayList<>();
        List<String> yearList = GraphUtil.getYearList(reportsStored);
        String unit = "";
        for(String product : GraphUtil.PRODUCT_LIST) {
            unit = GraphUtil.buildUnit(reportsStored.get(yearList.get(0)).get(product).get(type));
            for(String year : yearList) {
                Double yTick = GraphUtil.buildPointRepresentation(reportsStored.get(year).get(product).get(type), unit);
                costYearList.add(yTick);
            }
        }

        Double max = Collections.max(costYearList);
        Double min = Collections.min(costYearList);
        min = min<0.0 ? -150.0 : 0.0;
        return GraphUtil.createYAxis(min, max*2, unit);
    }
}
