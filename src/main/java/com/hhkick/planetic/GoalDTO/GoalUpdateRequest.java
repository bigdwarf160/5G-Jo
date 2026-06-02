package com.hhkick.planetic.GoalDTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class GoalUpdateRequest {

    private String goalName;
    private LocalDate startDate;
    private LocalDate endDate;
    private int totalAmount;
}