package com.hhkick.planetic.GoalDTO;

import java.util.List;

public class GoalDetailDto {

    private int goalId;
    private String goalName;
    private int plannedAmount;
    private List<String> detailname;

    public GoalDetailDto(int goalId,
                         String goalName,
                         int plannedAmount,
                         List<String> detailname) {
        this.goalId = goalId;
        this.goalName = goalName;
        this.plannedAmount = plannedAmount;
        this.detailname = detailname;
    }

    public int getGoalId() {
        return goalId;
    }

    public String getGoalName() {
        return goalName;
    }

    public int getPlannedAmount() {
        return plannedAmount;
    }

    public List<String> getDetails() {
        return detailname;
    }
}