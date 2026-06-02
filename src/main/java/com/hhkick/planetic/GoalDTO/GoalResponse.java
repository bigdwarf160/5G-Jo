package com.hhkick.planetic.GoalDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;


import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class GoalResponse {

    private int goalId;
    private String goalName;
    private LocalDate startDate;
    private LocalDate endDate;
    private int totalAmount;
    private int completedAmount;
    private String status;
    private List<String> detailNames;
}
