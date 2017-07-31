package com.simulation.graph.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.simulation.graph.model.Cost;
import com.simulation.graph.model.Graph;
import com.simulation.graph.model.GraphInput;
import com.simulation.graph.model.UserInput;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
public class GraphService {

    final static BigDecimal BENCHMARK_SCORE = new BigDecimal(5031.0); //to be calculated , max of blueScore
    final static BigDecimal BASE_SCORE = new BigDecimal(50.00);
    final static BigDecimal BLUE_BENCHMARK_PRICE = new BigDecimal(6.0f);
    final static BigDecimal RED_BENCHMARK_PRICE = new BigDecimal(6.0f);
    final static BigDecimal YELLOW_BENCHMARK_PRICE = new BigDecimal(6.0f);
    final static BigDecimal GREEN_BENCHMARK_PRICE = new BigDecimal(6.0f);
    final static String DEDUCTION_CAP = "deductionCap";
    final static BigDecimal OVERALL_MARKET_SHARE_IN_UNIT = new BigDecimal(100000000); //100M
    final static BigDecimal FIXED_COST =  new BigDecimal(10000000); //10M
    final static BigDecimal MARKETING_FACTOR = new BigDecimal(0.1);
    final static BigDecimal DISTRIBUTION_FACTOR = new BigDecimal(0.1);

    final static Gson gson = new Gson();

    private BigDecimal calculateDeltaScore(UserInput graphInputModel, Map<String, Map> graphWeightageModel){
        Map<String, BigDecimal> graphScore = new HashMap<>();

        BigDecimal score = new BigDecimal(0.0);
        Map<String, Map> dataPointMap = graphInputModel.getDataPoint();
        //datapoint:styles
        for(String dataPoint: dataPointMap.keySet()){
            Map dataInput = dataPointMap.get(dataPoint);
            BigDecimal dataInputScore = new BigDecimal(0.0);
//            BigDecimal maxDataInputScore = new BigDecimal(0.0);
            Map graphWeightageDataPointModelMap = graphWeightageModel.get("weightage");
            Map graphWeightageDataPointModel = (Map)graphWeightageDataPointModelMap.get(dataPoint);
            //type:pods
            for(Object type : dataInput.keySet()){

                BigDecimal weightagePerDatapoint = new BigDecimal((Double)graphWeightageDataPointModel.get(type));
                BigDecimal dataInputPerDatapoint = new BigDecimal((Double)dataInput.get(type.toString()));
                dataInputScore =  dataInputScore.add(dataInputPerDatapoint).multiply(weightagePerDatapoint);
//                long maxWeightage = 0L;
//                if((Long)graphWeightageModel.get(dataPoint).get(type) > maxWeightage){
//                    maxWeightage = (Long)graphWeightageModel.get(dataPoint).get(type);
//                }
//                maxDataInputScore +=  check logic
            }
            score = new BigDecimal((Double)graphWeightageDataPointModel.get("score"));
            graphScore.put(dataPoint, score.multiply(dataInputScore));
        }

        BigDecimal blueScore = new BigDecimal(0.0);
        for(String dataPoint: graphScore.keySet()){
            blueScore = blueScore.add(graphScore.get(dataPoint));
        }

        return blueScore.divide(BENCHMARK_SCORE, RoundingMode.FLOOR).subtract(BASE_SCORE).subtract(graphInputModel.getUnitPrice()).add(BLUE_BENCHMARK_PRICE) ;
    }

    public Cost calculateOperatingProfit(GraphInput graphInput, Graph marketShare, Graph deduction, Graph weightage, Graph styleFactor){

        HashMap graphInputReader = gson.fromJson(graphInput.getUserInput(), HashMap.class);
        UserInput graphInputModel = new UserInput();
        BigDecimal unitPrice = new BigDecimal((Double)graphInputReader.get("unitPrice"));
        graphInputModel.setUnitPrice(unitPrice);
        BigDecimal productionUnit = new BigDecimal((Double)graphInputReader.get("productionUnit"));
        graphInputModel.setProductionUnit(productionUnit);
        BigDecimal unitCost = new BigDecimal((Double)graphInputReader.get("unitCost"));
        graphInputModel.setUnitCost(unitCost);
        HashMap<String, Map> blue2015dataPoints = new HashMap<>();
        blue2015dataPoints.put("style",(Map)graphInputReader.get("style"));
        blue2015dataPoints.put("productPlacement",(Map)graphInputReader.get("productPlacement"));
        blue2015dataPoints.put("distribution",(Map)graphInputReader.get("distribution"));
        blue2015dataPoints.put("media",(Map)graphInputReader.get("media"));
        blue2015dataPoints.put("incomeGroup",(Map)graphInputReader.get("incomeGroup"));
        blue2015dataPoints.put("ethnicity",(Map)graphInputReader.get("ethnicity"));
        blue2015dataPoints.put("householdSizes",(Map)graphInputReader.get("householdSizes"));
        blue2015dataPoints.put("region",(Map)graphInputReader.get("region"));
        blue2015dataPoints.put("age",(Map)graphInputReader.get("age"));
        graphInputModel.setDataPoint(blue2015dataPoints);

        Map<String, Map> graphWeightageModel = gson.fromJson(weightage.getModel(), new TypeToken<Map<String, Map>>(){}.getType());
        System.out.println(marketShare.getModel());
        Map<String, BigDecimal> marketShareModel = gson.fromJson(marketShare.getModel(), new TypeToken<Map<String, BigDecimal>>(){}.getType());
        Map<String, BigDecimal> styleFactorModel = gson.fromJson(styleFactor.getModel(), new TypeToken<Map<String, BigDecimal>>(){}.getType());
        Map<String, Map<String, BigDecimal>> graphDeductions = gson.fromJson(deduction.getModel(), new TypeToken<Map<String, Map<String, BigDecimal>>>(){}.getType());

        BigDecimal delta = calculateDeltaScore(graphInputModel, graphWeightageModel);

        BigDecimal red2015Deduction = calculateYearlyDeductions(graphDeductions, "red", marketShareModel, delta);
        BigDecimal green2015Deduction = calculateYearlyDeductions(graphDeductions, "green", marketShareModel, delta);
        BigDecimal yellow2015Deduction = calculateYearlyDeductions(graphDeductions, "yellow", marketShareModel, delta);
        BigDecimal blue2015Deduction = calculateYearlyDeductions(graphDeductions, "blue", marketShareModel, delta);

        Map<String, BigDecimal> productYearlyDeductions  = new HashMap<>();
        productYearlyDeductions.put("red", red2015Deduction);
        productYearlyDeductions.put("green", green2015Deduction);
        productYearlyDeductions.put("yellow", yellow2015Deduction);
        productYearlyDeductions.put("blue", blue2015Deduction);

        final BigDecimal blueProductionInputUnits =  graphInputModel.getProductionUnit(); //cuz blue ka hi he
        final BigDecimal blueMaxProductionUnitsDemand = marketShareModel.get("blue").multiply(OVERALL_MARKET_SHARE_IN_UNIT).divide(new BigDecimal(100), RoundingMode.FLOOR);
        final BigDecimal blueActualDemand = blueProductionInputUnits.min(blueMaxProductionUnitsDemand);

        final BigDecimal blueInventory = blueProductionInputUnits.subtract(blueActualDemand);

        final BigDecimal blueRevenue = graphInputModel.getUnitPrice().multiply(blueActualDemand);

        BigDecimal blueUnitCost = calculateUnitCost(graphInputModel, styleFactorModel);

        BigDecimal blueVariableCost = blueUnitCost.multiply(blueProductionInputUnits);

        BigDecimal blueMarketingCost = MARKETING_FACTOR.multiply(blueVariableCost);

        BigDecimal blueDistributionCost = DISTRIBUTION_FACTOR.multiply(blueVariableCost);

        BigDecimal blueTotalCost = blueVariableCost.add(blueMarketingCost).add(blueDistributionCost).add(FIXED_COST);
        BigDecimal blueOperatingProfit =  blueRevenue.subtract(blueTotalCost);

        Cost blueCosts2015 = new Cost();
        blueCosts2015.setType("blue2015");
        blueCosts2015.setYear("2015");
        blueCosts2015.setProductionInputUnits(blueProductionInputUnits);
        blueCosts2015.setMaxProductionUnitsDemand(blueMaxProductionUnitsDemand);
        blueCosts2015.setActualDemand(blueActualDemand);
        blueCosts2015.setInventory(blueInventory);
        blueCosts2015.setRevenue(blueRevenue);
        blueCosts2015.setUnitCost(blueUnitCost);
        blueCosts2015.setVariableCost(blueVariableCost);
        blueCosts2015.setMarketingCost(blueMarketingCost);
        blueCosts2015.setDistributionCost(blueDistributionCost);
        blueCosts2015.setTotalCost(blueTotalCost);
        blueCosts2015.setOperatingProfit(blueOperatingProfit);
        blueCosts2015.setFixedCost(FIXED_COST);
        return blueCosts2015;
    }

    private BigDecimal calculateUnitCost(UserInput graphInputModel, Map<String, BigDecimal> styleFactorModel){
        Map styleInput =  graphInputModel.getDataPoint().get("style");

        String selectedStyle = "";
        for(Object style : styleInput.keySet()){
            Double styleDataPoint = (Double) styleInput.get(style);
            if(styleDataPoint>0){
                selectedStyle = style.toString();
                break;
            }
        }

        return graphInputModel.getUnitCost().multiply(styleFactorModel.get(selectedStyle));
    }

    private BigDecimal calculateYearlyDeductions(Map<String, Map<String, BigDecimal>> graphDeductions, String productName, Map<String, BigDecimal> marketShareModel, BigDecimal delta){
        Map<String, BigDecimal> productDeductionPoints = graphDeductions.get(productName);
        BigDecimal deductionYearCap = productDeductionPoints.get(DEDUCTION_CAP).multiply(marketShareModel.get(productName));
        BigDecimal deductionYearScore = new BigDecimal(0);
        for(String dataPoint: productDeductionPoints.keySet()){
            deductionYearScore =  deductionYearScore.add(productDeductionPoints.get(dataPoint)).multiply(delta);
        }

        return deductionYearScore.max(deductionYearCap);
    }
}
