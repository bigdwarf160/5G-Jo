package com.hhkick.planetic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "goal_details")
@Getter
@Setter
public class GoalDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int detailId;

    @ManyToOne
    @JoinColumn(name = "goal_id")
    private Goal goal;

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Column(name = "planned_amount")
    private int plannedAmount;
    @Column(name = "detail_name", nullable = false)
    private String detailName;

}