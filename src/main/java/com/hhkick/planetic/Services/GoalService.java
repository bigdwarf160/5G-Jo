package com.hhkick.planetic.Services;

import com.hhkick.planetic.GoalDTO.*;
import com.hhkick.planetic.entity.Goal;
import com.hhkick.planetic.entity.User;
import com.hhkick.planetic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hhkick.planetic.entity.GoalDetails;

import java.time.LocalDate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final GoalDetailsRepository goalDetailsRepository;

    // 목표 생성
    public Goal createGoal(
            GoalCreateRequest req
    ){

        User user =
                userRepository
                        .findByUserId(
                                req.getUserName()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "유저 없음"
                                        )
                        );

        Goal goal =
                new Goal();

        goal.setUser(user);

        goal.setUserName(
                req.getUserName()
        );

        goal.setGoalName(
                req.getGoalName()
        );

        goal.setGoalType(
                req.getGoalType()
        );

        goal.setUnit(
                req.getUnit()
        );

        goal.setStudyTime(
                req.getStudyTime()
        );

        goal.setDailyGoal(
                req.getDailyGoal()
        );

        goal.setStartDate(
                req.getStartDate()
        );

        goal.setEndDate(
                req.getEndDate()
        );

        goal.setTotalAmount(
                req.getTotalAmount()
        );

        goal.setCompletedAmount(0);

        goal.setStatus(
                Goal.Status.진행중
        );

        return goalRepository
                .save(goal);
    }

    // 목표 수정
    @Transactional
    public void updateGoal(int goalId, GoalUpdateRequest req) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("목표 없음"));

        if (req.getGoalName() != null) {
            goal.setGoalName(req.getGoalName());
        }
    }

    // 목표 삭제
    public void deleteGoal(int goalId) {


        goalRepository.deleteById(goalId);
    }

    // 목표 조회
    public List<GoalResponse> getGoals(
            String userName
    ) {

        return goalRepository
                .findByUserName(
                        userName
                )
                .stream()
                .map(g -> new GoalResponse(
                        g.getGoalId(),
                        g.getGoalName(),
                        g.getStartDate(),
                        g.getEndDate(),
                        g.getTotalAmount(),
                        g.getCompletedAmount(),
                        g.getStatus().name(),
                        g.getGoalDetails()
                                .stream()
                                .map(
                                        GoalDetails::getDetailName
                                )
                                .toList()
                ))
                .toList();
    }

    // =============================
// 오늘 할 일 조회 (🔥 추가)
// =============================
    public List<GoalDetailDto> getTodayGoals(
            String userName
    ) {

        LocalDate today =
                LocalDate.now();

        return goalRepository
                .findByUserName(
                        userName
                )
                .stream()
                .map(goal -> {

                    List<String> detailNames =
                            goal.getGoalDetails()
                                    .stream()
                                    .filter(
                                            detail ->
                                                    detail
                                                            .getTargetDate()
                                                            .equals(today)
                                    )
                                    .map(
                                            GoalDetails::getDetailName
                                    )
                                    .toList();

                    return new GoalDetailDto(
                            goal.getGoalId(),
                            goal.getGoalName(),
                            detailNames.size(),
                            detailNames
                    );
                })
                .filter(
                        dto ->
                                !dto.getDetails()
                                        .isEmpty()
                )
                .toList();
    }

    // =============================
    public List<GoalResponse> getGoalList(
            String userName
    ){

        return goalRepository
                .findByUserName(
                        userName
                )
                .stream()
                .map(goal -> new GoalResponse(
                        goal.getGoalId(),
                        goal.getGoalName(),
                        goal.getStartDate(),
                        goal.getEndDate(),
                        goal.getTotalAmount(),
                        goal.getCompletedAmount(),
                        goal.getStatus().name(),
                        goal.getGoalDetails()
                                .stream()
                                .map(
                                        GoalDetails::getDetailName
                                )
                                .toList()
                ))
                .toList();
    }

    //목표 실패찾기 로직
    public GoalResponseDTO calculateNewDailyGoal(
            GoalRequestDTO request
    ) {

        if (request.getRemainingDays() <= 0) {
            throw new IllegalArgumentException("남은 날짜 없음");
        }

        int remainingGoal =
                request.getTotalGoal()
                        - request.getCompletedSoFar();

        int todayMissed =
                request.getTodayPlanned()
                        - request.getTodayDone();

        if (todayMissed < 0) {
            todayMissed = 0;
        }

        int adjustedRemaining =
                remainingGoal + todayMissed;

        int newDailyGoal =
                (int) Math.ceil(
                        (double) adjustedRemaining
                                / request.getRemainingDays()
                );

        // 하루 목표 급상승 제한
        int maxIncrease =
                (int) (request.getTodayPlanned() * 1.2);

        if (newDailyGoal > maxIncrease) {
            newDailyGoal = maxIncrease;
        }

        // 최소 목표 보장
        if (newDailyGoal < 1) {
            newDailyGoal = 1;
        }

        return new GoalResponseDTO(
                newDailyGoal,
                todayMissed,
                remainingGoal
        );
    }

    @Transactional
    public void updateProgress(
            int goalId,
            Integer completedAmount
    ) {

        Goal goal =
                goalRepository
                        .findById(goalId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "목표 없음"
                                        )
                        );

        goal.setCompletedAmount(
                completedAmount
        );

        if (
                completedAmount >=
                        goal.getTotalAmount()
        ) {

            goal.setStatus(
                    Goal.Status.완료
            );

        } else {

            goal.setStatus(
                    Goal.Status.진행중
            );
        }
    }

    @Transactional
    public void updateDailyGoal(
            int goalId,
            int dailyGoal
    ){

        Goal goal =
                goalRepository
                        .findById(goalId)
                        .orElseThrow();

        goal.setDailyGoal(
                dailyGoal
        );
    }

    public List<Goal> getGoalsByUser(
            String userName
    ){

        return goalRepository
                .findByUserName(
                        userName
                );
    }
}
