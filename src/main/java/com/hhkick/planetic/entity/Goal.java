package com.hhkick.planetic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class Goal {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private int goalId;

    @ManyToOne
    @JoinColumn(
            name = "user_id"
    )
    private User user;

    private String goalName;

    private String goalType;

    private LocalDate startDate;

    private LocalDate endDate;

    private int totalAmount;

    private int completedAmount;

    private String unit;

    private String studyTime;

    private int dailyGoal;

    private String userName;

    @Enumerated(
            EnumType.STRING
    )
    private Status status;

    public enum Status {
        진행중,
        완료,
        중단
    }

    @OneToMany(
            mappedBy = "goal",
            cascade =
                    CascadeType.ALL
    )
    private List<GoalDetails>
            goalDetails;
}