package com.hhkick.planetic.GoalDTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AIPlanResponse {

    private int newDailyGoal;

    private int remainingGoal;

    private List<String> replannedTasks;

    private String risk;

    private String advice;
}