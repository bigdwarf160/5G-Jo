package com.hhkick.planetic.repository;

import com.hhkick.planetic.entity.GoalDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface GoalDetailsRepository extends JpaRepository<GoalDetails, Integer> {

    @Query("""
        SELECT d
        FROM GoalDetails d
        WHERE d.goal.user.userId = :userId
        AND d.targetDate = :today
    """)
    List<GoalDetails> findTodayTasks(@Param("userId") String userId,
                                     @Param("today") LocalDate today);
}