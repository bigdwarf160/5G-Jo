package com.hhkick.planetic.repository;


import com.hhkick.planetic.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository
        extends JpaRepository<Goal,Integer> {

    List<Goal> findByUserName(
            String userName
    );
}

