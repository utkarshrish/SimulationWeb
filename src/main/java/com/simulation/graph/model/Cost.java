package com.simulation.graph.model;

import java.math.BigDecimal;

public class Cost {
    private BigDecimal marketShare;
    private BigDecimal productionInputUnits;
    private BigDecimal maxProductionUnitsDemand;
    private BigDecimal actualDemand;
    private BigDecimal inventory;
    private BigDecimal revenue;
    private BigDecimal unitCost;
    private BigDecimal unitPrice;
    private BigDecimal variableCost;
    private BigDecimal marketingCost;
    private BigDecimal distributionCost;
    private BigDecimal otherCost;
    private BigDecimal totalCost;
    private BigDecimal operatingProfit;
    private BigDecimal cumulativeOperatingProfit;
    private BigDecimal fixedCost;

    public Cost() {}

    public Cost(BigDecimal productionInputUnits, BigDecimal maxProductionUnitsDemand, BigDecimal actualDemand,
                 BigDecimal inventory, BigDecimal revenue, BigDecimal unitPrice, BigDecimal unitCost, BigDecimal variableCost, BigDecimal marketingCost,
                 BigDecimal distributionCost, BigDecimal totalCost, BigDecimal marketShare,
                BigDecimal operatingProfit, BigDecimal fixedCost, BigDecimal cumulativeOperatingProfit) {
        this.marketShare = marketShare;
        this.productionInputUnits = productionInputUnits;
        this.maxProductionUnitsDemand = maxProductionUnitsDemand;
        this.actualDemand = actualDemand;
        this.inventory = inventory;
        this.revenue = revenue;
        this.unitCost = unitCost;
        this.unitPrice = unitPrice;
        this.variableCost = variableCost;
        this.marketingCost = marketingCost;
        this.distributionCost = distributionCost;
        this.totalCost = totalCost;
        this.operatingProfit = operatingProfit;
        this.fixedCost = fixedCost;
        this.cumulativeOperatingProfit = cumulativeOperatingProfit;
    }

    public BigDecimal getMarketShare() {
        return marketShare;
    }

    public void setMarketShare(BigDecimal marketShare) {
        this.marketShare = marketShare;
    }

    public BigDecimal getProductionInputUnits() {
        return productionInputUnits;
    }

    public void setProductionInputUnits(BigDecimal productionInputUnits) {
        this.productionInputUnits = productionInputUnits;
    }

    public BigDecimal getMaxProductionUnitsDemand() {
        return maxProductionUnitsDemand;
    }

    public void setMaxProductionUnitsDemand(BigDecimal maxProductionUnitsDemand) {
        this.maxProductionUnitsDemand = maxProductionUnitsDemand;
    }

    public BigDecimal getActualDemand() {
        return actualDemand;
    }

    public void setActualDemand(BigDecimal actualDemand) {
        this.actualDemand = actualDemand;
    }

    public BigDecimal getInventory() {
        return inventory;
    }

    public void setInventory(BigDecimal inventory) {
        this.inventory = inventory;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getVariableCost() {
        return variableCost;
    }

    public void setVariableCost(BigDecimal variableCost) {
        this.variableCost = variableCost;
    }

    public BigDecimal getMarketingCost() {
        return marketingCost;
    }

    public void setMarketingCost(BigDecimal marketingCost) {
        this.marketingCost = marketingCost;
    }

    public BigDecimal getDistributionCost() {
        return distributionCost;
    }

    public void setDistributionCost(BigDecimal distributionCost) {
        this.distributionCost = distributionCost;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public BigDecimal getOperatingProfit() {
        return operatingProfit;
    }

    public void setOperatingProfit(BigDecimal operatingProfit) {
        this.operatingProfit = operatingProfit;
    }

    public BigDecimal getFixedCost() {
        return fixedCost;
    }

    public BigDecimal getCumulativeOperatingProfit() {
        return cumulativeOperatingProfit;
    }

    public void setCumulativeOperatingProfit(BigDecimal cumulativeOperatingProfit) {
        this.cumulativeOperatingProfit = cumulativeOperatingProfit;
    }

    public void setFixedCost(BigDecimal fixedCost) {
        this.fixedCost = fixedCost;
    }

    public BigDecimal getOtherCost() {
        return otherCost;
    }

    public void setOtherCost(BigDecimal otherCost) {
        this.otherCost = otherCost;
    }
}
