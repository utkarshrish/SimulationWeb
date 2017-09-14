package com.simulation.graph;

import com.simulation.graph.model.UserInput;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class GraphUtil {

    public final static DecimalFormat PRICE_FORMAT = new DecimalFormat("#.##");

    public final static List<String> X_TICKS;
    public final static int YAXIS_TICKS = 6;

    static {
        X_TICKS = new ArrayList<>();
        X_TICKS.add("2015");
        X_TICKS.add("2016");
        X_TICKS.add("2017");
        X_TICKS.add("2018");
        X_TICKS.add("2019");
        X_TICKS.add("2020");
        X_TICKS.add("2021");
        X_TICKS.add("2022");
    }

    public final static List<String> PRODUCT_LIST;
    static {
        PRODUCT_LIST = new ArrayList<>();
        PRODUCT_LIST.add("red");
        PRODUCT_LIST.add("yellow");
        PRODUCT_LIST.add("green");
        PRODUCT_LIST.add("blue");
    }

    public static Map<String, Object> createXAxis(){
        Map<String, Object> xAxis = new HashMap<>();
        xAxis.put("transformAxisX", 33);
        xAxis.put("transformAxisY", 346);
        xAxis.put("width", 547);
        xAxis.put("transformY", 0);
        xAxis.put("unit", "y");
        xAxis.put("ticks", createTicks(X_TICKS));

        return xAxis;
    }

    public static List<Map> createTicks(List<String> ticks){
        List<Map> ticksList = new ArrayList<>();
        for(String tick: ticks) {
            Map<String, String> tickMap = new HashMap<>();
            tickMap.put("text", tick);
            ticksList.add(tickMap);
        }
        return ticksList;
    }

    public static List<String> getYearList(Map<String, Map<String, Map<String, BigDecimal>>> reportsStored){
        return reportsStored.keySet().stream().sorted().collect(Collectors.toList());
    }

    public static Map<String, Object> createYAxis(double minValue, double maxValue, String unit){
        double range = maxValue - minValue;
        List<String> yTicks = new ArrayList<>();
        yTicks.add(PRICE_FORMAT.format(minValue));
        yTicks.add(PRICE_FORMAT.format(minValue + range/(YAXIS_TICKS-1)));
        yTicks.add(PRICE_FORMAT.format(minValue + 2 * range/(YAXIS_TICKS-1)));
        yTicks.add(PRICE_FORMAT.format(minValue + 3 * range/(YAXIS_TICKS-1)));
        yTicks.add(PRICE_FORMAT.format(minValue + 4 * range/(YAXIS_TICKS-1)));
        yTicks.add(PRICE_FORMAT.format(maxValue));

        Map<String, Object> yAxis = new HashMap<>();
        yAxis.put("transformAxisX", 33);
        yAxis.put("transformAxisY", 6);
        yAxis.put("height", 340);
        yAxis.put("transformY", 0);
        yAxis.put("unit", unit);
        yAxis.put("ticks", GraphUtil.createTicks(yTicks));
        return yAxis;
    }

    public static String buildUnit(BigDecimal value){
        if(value.doubleValue()<0){
            value = value.multiply(new BigDecimal("-1.0"));
        }
        if(value.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue()>1000000) {
            double convertedValue = value.movePointLeft(6).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            if (convertedValue < 1000.0) {
                return "M";
            } else if (convertedValue >= 1000.0) {
                return "B";
            }
        }
        return "";
    }

    public static Double buildPointRepresentation(BigDecimal value, String unit){
        if(unit.equalsIgnoreCase("M")){
            return value.movePointLeft(6).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
        }
        else if(unit.equalsIgnoreCase("B")){
            return value.movePointLeft(9).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
        }
        return value.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    public static UserInput buildGraphInput(Map graphInput){
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

    private static BigDecimal convertMillion(String input){
        if(input.indexOf("M")>0){
            BigDecimal number = new BigDecimal(input.split("M")[0]);
            return number.movePointRight(6);
        } else if(input.indexOf("m")>0){
            BigDecimal number = new BigDecimal(input.split("m")[0]);
            return number.movePointRight(6);
        }
        return new BigDecimal(input);
    }
}
