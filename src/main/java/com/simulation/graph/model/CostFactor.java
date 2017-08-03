package com.simulation.graph.model;

public enum CostFactor {
    UNIT_COST(10.0f),
    POWDER(1.0f),
    LIQUID(1.07f),
    PODS(1.15f);

    float costFactor;

    CostFactor(float costFactor) {
        this.costFactor = costFactor;
    }

    public float getCostFactor() {
        return costFactor;
    }
}
