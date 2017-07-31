package com.simulation.graph.model;

import java.math.BigDecimal;
import java.util.Map;

public class UserInput{
    BigDecimal unitPrice;
    BigDecimal unitCost;
    BigDecimal productionUnit;
    Map<String, Map> dataPoint;

    public UserInput() {}

    public UserInput(BigDecimal unitPrice, BigDecimal unitCost, BigDecimal productionUnit, Map<String, Map> dataPoint) {
        this.unitPrice = unitPrice;
        this.unitCost = unitCost;
        this.productionUnit = productionUnit;
        this.dataPoint = dataPoint;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getProductionUnit() {
        return productionUnit;
    }

    public void setProductionUnit(BigDecimal productionUnit) {
        this.productionUnit = productionUnit;
    }

    public Map<String, Map> getDataPoint() {
        return dataPoint;
    }

    public void setDataPoint(Map<String, Map> dataPoint) {
        this.dataPoint = dataPoint;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }
}
