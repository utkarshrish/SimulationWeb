package com.simulation.graph.model;

public enum CostFactor {
    POWDER(1.00f),
    LIQUID(1.00f),
    PODS(1.15f),
    ODORELIMINATION(1.10f),
    COLDWATER(1.00f),
    SCENT(1.05f),
    SOFTNESS(1.20f);

    float costFactor;

    CostFactor(float costFactor) {
        this.costFactor = costFactor;
    }

    public float getCostFactor() {
        return costFactor;
    }
}
