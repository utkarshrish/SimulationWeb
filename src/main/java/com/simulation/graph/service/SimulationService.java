package com.simulation.graph.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.simulation.graph.GraphInputRepository;
import com.simulation.graph.GraphRepository;
import com.simulation.graph.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class SimulationService {

    final static BigDecimal BENCHMARK_SCORE = new BigDecimal("85.33");
    final static BigDecimal PRICE_FACTOR = new BigDecimal("3.00");
    final static BigDecimal UNIT_COST_PRICE = new BigDecimal("3.00");
    final static BigDecimal PRICE_BENCHMARK = new BigDecimal("12.00");
    final static BigDecimal BASE_SCORE = BENCHMARK_SCORE.multiply(new BigDecimal("0.6"));
    final static BigDecimal BLUE_BENCHMARK_PRICE = new BigDecimal("6.00");
    final static BigDecimal RED_BENCHMARK_PRICE = new BigDecimal("6.00");
    final static BigDecimal YELLOW_BENCHMARK_PRICE = new BigDecimal("6.00");
    final static BigDecimal GREEN_BENCHMARK_PRICE = new BigDecimal("6.00");
    final static String DEDUCTION_CAP = "deductionCap";
    final static BigDecimal OVERALL_MARKET_SHARE_IN_UNIT = new BigDecimal("100000000.00"); //100M
    final static BigDecimal FIXED_COST =  new BigDecimal("10000000.00"); //10M
    final static BigDecimal MARKETING_FACTOR = new BigDecimal("0.10");
    final static BigDecimal DISTRIBUTION_FACTOR = new BigDecimal("0.10");
    final static BigDecimal DEDUCTION_MAX = new BigDecimal("18.00");
    final static BigDecimal MARKET_SHARE_DEDUCTION_CAP = new BigDecimal("0.60");

    final static Gson gson = new Gson();
    final static Map<String, BigDecimal> BENCHMARK_PRICE;

    static{
        BENCHMARK_PRICE = new HashMap<>();
        BENCHMARK_PRICE.put("blue", BLUE_BENCHMARK_PRICE);
        BENCHMARK_PRICE.put("red", RED_BENCHMARK_PRICE);
        BENCHMARK_PRICE.put("yellow", YELLOW_BENCHMARK_PRICE);
        BENCHMARK_PRICE.put("green", GREEN_BENCHMARK_PRICE);
    }

    @Autowired
    private GraphRepository repository;

    @Autowired
    private GraphInputRepository inputRepository;

    private BigDecimal calculateDeltaScore(UserInput graphInputModel, Map<String, Map> graphWeightageModel, String product){
        Map<String, BigDecimal> graphScore = new HashMap<>();

        BigDecimal score = new BigDecimal(0.0);
        Map<String, Map> dataPointMap = graphInputModel.getDataPoint();
        Map graphWeightageDataPointModelMap = graphWeightageModel.get("weightage");

        for(String dataPoint: dataPointMap.keySet()){
            Map dataInput = dataPointMap.get(dataPoint);
            Map graphWeightageDataPointModel = (Map)graphWeightageDataPointModelMap.get(dataPoint);
            BigDecimal dataInputScore = new BigDecimal("0.00");
            for(Object type : dataInput.keySet()){
                BigDecimal weightagePerDatapoint = new BigDecimal(graphWeightageDataPointModel.get(type).toString());
                BigDecimal dataInputPerDatapoint = new BigDecimal(dataInput.get(type.toString()).toString());
                dataInputScore =  dataInputScore.add(dataInputPerDatapoint.multiply(weightagePerDatapoint));
            }
            score = new BigDecimal(graphWeightageDataPointModel.get("score").toString());
            graphScore.put(dataPoint, score.multiply(dataInputScore));
        }

        BigDecimal productScore = new BigDecimal("0.00");

        for(String dataPoint: graphScore.keySet()){
            productScore = productScore.add(graphScore.get(dataPoint));
        }

        BigDecimal priceScore;
        if(graphInputModel.getUnitPrice().intValue() > new BigDecimal("6.00").intValue()){
            priceScore = graphInputModel.getUnitPrice().subtract(new BigDecimal("5.00")).multiply(new BigDecimal("-5.00"));
        } else {
            priceScore = graphInputModel.getUnitPrice().subtract(new BigDecimal("7.00")).multiply(new BigDecimal("-3.00"));
        }

//        BigDecimal priceScore = graphInputModel.getUnitPrice().min(PRICE_BENCHMARK);
//        priceScore =  BENCHMARK_PRICE.get(product).add(BENCHMARK_PRICE.get(product).subtract(priceScore));

        BigDecimal totalScore = productScore.add(priceScore);

        return totalScore.subtract(BASE_SCORE).divide(BENCHMARK_SCORE.subtract(BASE_SCORE), BigDecimal.ROUND_HALF_EVEN);
    }

    private UserInput buildGraphInput(String product, String year){
        GraphInput graphInput = this.inputRepository.findOne(product + year);
        Map graphInputModel = gson.fromJson(graphInput.getUserInput(), Map.class);
        return buildGraphInput(graphInputModel);
    }

    private Map<String, BigDecimal> buildProductMarketShare(Map<String, BigDecimal> productYearlyDeduction, Map<String, UserInput> graphInputModels,
                                                            Graph deduction, Map<String, BigDecimal> yearlyMarketShare, Map<String, BigDecimal> marketShare2014){
        Map<String, Map> blueDataPoints = graphInputModels.get("blue").getDataPoint();
        Map<String, Map> redDataPoints = graphInputModels.get("red").getDataPoint();
        Map<String, Map> yellowDataPoints = graphInputModels.get("yellow").getDataPoint();
        Map<String, Map> greenDataPoints = graphInputModels.get("green").getDataPoint();

        Map<String, Set<String>> marketShareDeductions = new HashMap<>();

        for(String dataPoint: blueDataPoints.keySet()){
            Set<String> productMarketShare = new HashSet<>();
            Map marketSharePerDataPoint = blueDataPoints.get(dataPoint);
            for(Object subDataPoint : marketSharePerDataPoint.keySet()) {
                if ( new BigDecimal(marketSharePerDataPoint.get(subDataPoint.toString()).toString()).doubleValue() > 0.0) {
                    if (new BigDecimal(redDataPoints.get(dataPoint).get(subDataPoint).toString()).doubleValue() > 0.0) {
                        productMarketShare.add("red");
                    }
                    if (new BigDecimal(yellowDataPoints.get(dataPoint).get(subDataPoint).toString()).doubleValue() > 0.0) {
                        productMarketShare.add("yellow");
                    }
                    if (new BigDecimal(greenDataPoints.get(dataPoint).get(subDataPoint).toString()).doubleValue() > 0.0) {
                        productMarketShare.add("green");
                    }
                }
            }
            marketShareDeductions.put(dataPoint, productMarketShare);
        }

        Map<String, Map<String, BigDecimal>> marketSharePerDataPoint = gson.fromJson(deduction.getModel(),
                new TypeToken<Map<String, Map<String, BigDecimal>>>(){}.getType());

        Map<String,Map<String, BigDecimal>> productMarketShareDeductionPerDataPoint = new HashMap<>();

        for(String product: yearlyMarketShare.keySet()) {
            Map<String, BigDecimal> marketShareDeductionPerDataPoint = new HashMap<>();
            for (String dataPoint : marketShareDeductions.keySet()) {
                marketShareDeductionPerDataPoint.put(dataPoint, productYearlyDeduction.get(product)
                        .multiply(marketSharePerDataPoint.get(product).get(dataPoint)));
            }
            productMarketShareDeductionPerDataPoint.put(product, marketShareDeductionPerDataPoint);
        }

        Map<String, BigDecimal> productMarketShare = new HashMap<>();

        BigDecimal blueMarketShare = yearlyMarketShare.get("blue");

        for(String product: yearlyMarketShare.keySet()){
            BigDecimal marketShare = yearlyMarketShare.get(product);
            BigDecimal marketShareCalculated = new BigDecimal("0.0");
            for(String dataPoint : marketShareDeductions.keySet()){
                if(!product.equalsIgnoreCase("blue")){
                    if(marketShareDeductions.get(dataPoint).contains(product)) {
                        marketShareCalculated = marketShareCalculated.add(productMarketShareDeductionPerDataPoint.get(product).get(dataPoint));
                    }
                }
            }
            if(!product.equalsIgnoreCase("blue")) {
                if(marketShare.subtract(marketShareCalculated).intValue()> marketShare2014.get(product).multiply(MARKET_SHARE_DEDUCTION_CAP).intValue()) {
                    marketShare = marketShare.subtract(marketShareCalculated.abs());
                    blueMarketShare = blueMarketShare.add(marketShareCalculated.abs());
                }
                productMarketShare.put(product, marketShare);
            }
        }
        productMarketShare.put("blue", blueMarketShare);
        return productMarketShare;
    }

    public void buildReports(String userId, Map graphInput, Graph deduction, Graph weightage, String year){
        final Map<String, UserInput> graphInputModels = new HashMap<>();
        graphInputModels.put("red", buildGraphInput("red", year));
        graphInputModels.put("green", buildGraphInput("green", year));
        graphInputModels.put("yellow", buildGraphInput("yellow", year));
        graphInputModels.put("blue", buildGraphInput(graphInput));
//        graphInputModels.put("blue", buildGraphInput("blue", year));

        Graph marketShareGraph = repository.findOne(userId + "_marketShare");
        Map<String, Map<String, BigDecimal>> marketShareStored = gson.fromJson(marketShareGraph.getModel()
                , new TypeToken<Map<String,Map<String, BigDecimal>>>(){}.getType());
        Map<String, BigDecimal> marketShare2014 = marketShareStored.get("2014");
        Map<String, BigDecimal> yearlyMarketShare = marketShareStored.get(String.valueOf(Integer.valueOf(year)-1));

        Map<String, Map> graphWeightageModel = gson.fromJson(weightage.getModel(), new TypeToken<Map<String, Map>>(){}.getType());
        Map<String, Map<String, BigDecimal>> graphDeductions = gson.fromJson(deduction.getModel(), new TypeToken<Map<String, Map<String, BigDecimal>>>(){}.getType());

        final Map<String, Cost> productCost = new HashMap<>();
        final Map<String, BigDecimal> productYearlyDeduction = new HashMap<>();

        for(String product: yearlyMarketShare.keySet()) {
            UserInput graphInputModel = graphInputModels.get(product);
            BigDecimal yearDelta = calculateDeltaScore(graphInputModel, graphWeightageModel, product);
            BigDecimal yearlyDeduction = calculateYearlyDeductions(graphDeductions, product, yearlyMarketShare, yearDelta);
            productYearlyDeduction.put(product, yearlyDeduction);
        }

        Map<String, BigDecimal> productMarketShare = buildProductMarketShare(productYearlyDeduction, graphInputModels, deduction, yearlyMarketShare, marketShare2014);

        Map<String, Map<String, BigDecimal>> marketShareYearly = new HashMap<>();
        marketShareYearly.putAll(marketShareStored);
        marketShareYearly.put(year, productMarketShare);

        for(String product: yearlyMarketShare.keySet()) {
            UserInput graphInputModel = graphInputModels.get(product);
            BigDecimal productionInputUnits = graphInputModel.getProductionUnit();
            BigDecimal maxProductionUnitsDemand = yearlyMarketShare.get(product).multiply(OVERALL_MARKET_SHARE_IN_UNIT).divide(new BigDecimal(100.00), BigDecimal.ROUND_HALF_EVEN);
            BigDecimal actualDemand = productionInputUnits.min(maxProductionUnitsDemand);
            BigDecimal inventory = productionInputUnits.subtract(actualDemand);
            BigDecimal unitCost = UNIT_COST_PRICE.multiply(calculateUnitCost(graphInputModel, "style")).multiply(calculateUnitCost(graphInputModel,"productPlacement"));
            BigDecimal variableCost = unitCost.multiply(productionInputUnits);
            BigDecimal marketingCost = MARKETING_FACTOR.multiply(unitCost.multiply(productionInputUnits));
            BigDecimal distributionCost = DISTRIBUTION_FACTOR.multiply(unitCost.multiply(productionInputUnits));
            BigDecimal totalCost = variableCost.add(marketingCost).add(distributionCost).add(FIXED_COST);
            BigDecimal revenue = graphInputModel.getUnitPrice().multiply(actualDemand);
            BigDecimal operatingProfit = revenue.subtract(totalCost);

            Cost yearlyCost = new Cost();
            yearlyCost.setMarketShare(marketShareYearly.get(year).get(product));
            yearlyCost.setProductionInputUnits(productionInputUnits);
            yearlyCost.setMaxProductionUnitsDemand(maxProductionUnitsDemand);
            yearlyCost.setActualDemand(actualDemand);
            yearlyCost.setInventory(inventory);
            yearlyCost.setRevenue(revenue);
            yearlyCost.setUnitCost(unitCost);
            yearlyCost.setUnitPrice(graphInputModel.getUnitPrice());
            yearlyCost.setVariableCost(variableCost);
            yearlyCost.setMarketingCost(marketingCost);
            yearlyCost.setDistributionCost(distributionCost);
            yearlyCost.setOtherCost(marketingCost.add(distributionCost));
            yearlyCost.setTotalCost(totalCost);
            yearlyCost.setOperatingProfit(operatingProfit);
            yearlyCost.setCumulativeOperatingProfit(operatingProfit);
            yearlyCost.setFixedCost(FIXED_COST);

            productCost.put(product, yearlyCost);
        }

        Graph marketShareGraphUpdated = new Graph(userId + "_marketShare", "simulationGraph", gson.toJson(marketShareYearly));
        this.repository.save(marketShareGraphUpdated);

        Map<String, Map<String,Cost>> costYearly = new HashMap<>();
        Graph explorerGraph = repository.findOne(userId + "_reports");
        if(explorerGraph != null){
            final Map<String, Map<String,Cost>> previousCostYearly = gson.fromJson(explorerGraph.getModel()
                    , new TypeToken<Map<String, Map<String, Cost>>>(){}.getType());

            costYearly.putAll(previousCostYearly);

        }

        costYearly.put(year,productCost);

        Graph costYearlyUpdated = new Graph(userId + "_reports", "simulationGraph", gson.toJson(costYearly));
        this.repository.save(costYearlyUpdated);
    }

    public void buildReports(String userId, String graphInput, Graph deduction, Graph weightage, String year){
        buildReports(userId, gson.fromJson(graphInput, Map.class), deduction, weightage, year);
    }

    private UserInput buildGraphInput(Map graphInput){
        UserInput graphInputModel = new UserInput();
        BigDecimal unitPrice = convertMillion(graphInput.get("unitPrice").toString());
        graphInputModel.setUnitPrice(unitPrice);

        BigDecimal productionUnit = convertMillion(graphInput.get("productionUnit").toString());
        graphInputModel.setProductionUnit(productionUnit);

        BigDecimal unitCost = convertMillion(graphInput.get("unitCost").toString());
        graphInputModel.setUnitCost(unitCost);

        HashMap<String, Map> blueDataPoints = new HashMap<>();
        blueDataPoints.put("style",(Map)graphInput.get("style"));
        blueDataPoints.put("productPlacement",(Map)graphInput.get("productPlacement"));
        blueDataPoints.put("distribution",(Map)graphInput.get("distribution"));
        blueDataPoints.put("media",(Map)graphInput.get("media"));
        blueDataPoints.put("incomeGroup",(Map)graphInput.get("incomeGroup"));
        blueDataPoints.put("ethnicity",(Map)graphInput.get("ethnicity"));
        blueDataPoints.put("householdSizes",(Map)graphInput.get("householdSizes"));
        blueDataPoints.put("region",(Map)graphInput.get("region"));
        blueDataPoints.put("age",(Map)graphInput.get("age"));
        graphInputModel.setDataPoint(blueDataPoints);
        return graphInputModel;
    }

    private BigDecimal convertMillion(String input){
        if(input.indexOf("M")>0){
            BigDecimal number = new BigDecimal(input.split("M")[0]);
            return number.movePointRight(6);
        } else if(input.indexOf("m")>0){
            BigDecimal number = new BigDecimal(input.split("m")[0]);
            return number.movePointRight(6);
        }
        return new BigDecimal(input);
    }

    private BigDecimal calculateUnitCost(UserInput graphInputModel, String dataPoint){
        Map styleInput =  graphInputModel.getDataPoint().get(dataPoint);

        String selectedStyle = "";
        for(Object style : styleInput.keySet()){
            BigDecimal styleDataPoint = new BigDecimal(styleInput.get(style).toString());
            if(styleDataPoint.intValue()>0){
                selectedStyle = style.toString();
                break;
            }
        }

        final float effectiveUnitCost = CostFactor.valueOf(selectedStyle.toUpperCase()).getCostFactor();

        return new BigDecimal(effectiveUnitCost);
    }

    private BigDecimal calculateYearlyDeductions(Map<String, Map<String, BigDecimal>> graphDeductions, String productName, Map<String, BigDecimal> marketShareModel, BigDecimal delta){
        Map<String, BigDecimal> productDeductionPoints = graphDeductions.get(productName);
        BigDecimal deductionYearCap = productDeductionPoints.get(DEDUCTION_CAP).multiply(marketShareModel.get(productName));
        BigDecimal deductionYearScore = new BigDecimal("0.00");
        for(String dataPoint: productDeductionPoints.keySet()){
            deductionYearScore =  deductionYearScore.add(productDeductionPoints.get(dataPoint));
        }
        deductionYearScore = deductionYearScore.multiply(delta);

        return (deductionYearScore.min(deductionYearCap)).divide(DEDUCTION_MAX, BigDecimal.ROUND_HALF_EVEN);
    }
}