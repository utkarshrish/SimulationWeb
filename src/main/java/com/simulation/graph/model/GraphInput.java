package com.simulation.graph.model;

import org.springframework.data.annotation.Id;

public class GraphInput {

    private @Id String type;
    private String year;
    private String userInput;

    private GraphInput(){}

    public GraphInput(String type, String year, String userInput) {
        this.type = type;
        this.year = year;
        this.userInput = userInput;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getUserInput() {
        return userInput;
    }

    public void setUserInput(String userInput) {
        this.userInput = userInput;
    }
}
