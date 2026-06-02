package com.hhkick.planetic.GoalDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoalRequestDTO {

        private int totalGoal; //사용자가 설정한 전체 목표량
        private int completedSoFar; //현재까지 완료한 누적 작업량
        private int todayPlanned; //오늘 수행하기로 한 목표향
        private int todayDone; //오늘 완료한 작업량
        private int remainingDays; //목표 달성까지 남은 날짜
        private int difficultyPreference; //사용자의 난이도 선호도
    }
