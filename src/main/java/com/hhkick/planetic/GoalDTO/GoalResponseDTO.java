package com.hhkick.planetic.GoalDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoalResponseDTO {
    private int newDailyGoal; //남은 기간 동안 하루에 수행해야 할 새로운 목표량
    private int todayMissed; //오늘 계획 대비 달성하지 못한 작업량
    private int remainingGoal; //전체 목표에서 현재까지 완료한 양을 제외한 앞으로 달성해야 할 총량
}
