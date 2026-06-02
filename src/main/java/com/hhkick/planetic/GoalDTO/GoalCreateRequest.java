package com.hhkick.planetic.GoalDTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class GoalCreateRequest {

    private String goalName;

    private String goalType;

    private int totalAmount;

    private String unit;

    private LocalDate startDate;

    private LocalDate endDate;

    private String studyTime;

    private int dailyGoal;

    private String userName;
}