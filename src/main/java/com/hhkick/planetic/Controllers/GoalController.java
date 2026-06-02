package com.hhkick.planetic.Controllers;

import com.hhkick.planetic.GoalDTO.*;
import com.hhkick.planetic.Services.AIPlannerService;
import com.hhkick.planetic.Services.GoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hhkick.planetic.entity.Goal;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/goal")
@CrossOrigin(origins = "*")
public class GoalController {

    private final GoalService goalService;
    private final AIPlannerService aiPlannerService;

    public GoalController(
            GoalService goalService,
            AIPlannerService aIPlannerService) {
        this.goalService =
                goalService;

        this.aiPlannerService = aIPlannerService;
    }

    @PostMapping("/create")
    public Goal createGoal(
            @RequestBody
            GoalCreateRequest req
    ){

        return goalService
                .createGoal(req);
    }

    @PostMapping("/recalculate-ai")
    public AIPlanResponse recalculateAI(
            @RequestBody GoalRequestDTO req
    ){
        return aiPlannerService.makePlan(req);
    }

    @PostMapping("/recalculate")
    public GoalResponseDTO recalculate(
            @RequestBody
            GoalRequestDTO request
    ){
        return goalService
                .calculateNewDailyGoal(
                        request
                );
    }

    @PutMapping("/{goalId}")
    public String updateGoal(
            @PathVariable int goalId,
            @RequestBody GoalUpdateRequest req
    ){

        goalService.updateGoal(
                goalId,
                req
        );

        return "목표 수정 완료";
    }

    @DeleteMapping("/{goalId}")
    public String deleteGoal(
            @PathVariable int goalId
    ){

        goalService.deleteGoal(
                goalId
        );

        return "목표 삭제 완료";
    }

    @PatchMapping("/{goalId}/progress")
    public void updateProgress(
            @PathVariable int goalId,
            @RequestBody ProgressRequest request
    ) {

        goalService.updateProgress(
                goalId,
                request.getCompletedAmount()
        );
    }

    // DTO
    public static class ProgressRequest {

        private Integer completedAmount;

        public Integer getCompletedAmount() {
            return completedAmount;
        }

        public void setCompletedAmount(
                Integer completedAmount
        ) {
            this.completedAmount =
                    completedAmount;
        }
    }

    @GetMapping("/user/{userName}")
    public List<Goal> getGoalsByUser(
            @PathVariable String userName
    ){

        return goalService
                .getGoalsByUser(
                        userName
                );
    }

    @PatchMapping("/{goalId}/daily-goal")
    public void updateDailyGoal(
            @PathVariable int goalId,
            @RequestBody Map<String, Integer> request
    ){

        goalService.updateDailyGoal(
                goalId,
                request.get("dailyGoal")
        );
    }


}