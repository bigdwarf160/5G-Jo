package com.hhkick.planetic;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PlaneticApplicationTests {

    @Test
    void 정상케이스() {
        int result = calculateNewDailyGoal(100, 60, 10, 6, 5);
        assertEquals(9, result);
    }

    @Test
    void 초과달성() {
        int result = calculateNewDailyGoal(100, 60, 10, 12, 5);
        assertTrue(result <= 10);
    }

    @Test
    void 남은날짜0() {
        assertThrows(IllegalArgumentException.class, () -> {
            calculateNewDailyGoal(100, 80, 10, 5, 0);
        });
    }

    @Test
    void 거의끝난경우() {
        int result = calculateNewDailyGoal(100, 98, 10, 8, 5);
        assertEquals(1, result);
    }

    @Test
    void 하나도못한경우() {
        int result = calculateNewDailyGoal(100, 0, 10, 0, 10);
        assertTrue(result >= 10);
    }

    // 🔥 실제 로직
    private int calculateNewDailyGoal(
            int totalGoal,
            int completedSoFar,
            int todayPlanned,
            int todayDone,
            int remainingDays
    ) {
        if (remainingDays <= 0) {
            throw new IllegalArgumentException("남은 날짜 없음");
        }

        int remainingGoal = totalGoal - completedSoFar;

        int todayMissed = todayPlanned - todayDone;
        if (todayMissed < 0) todayMissed = 0;

        int adjustedRemaining = remainingGoal + todayMissed;

        int newDailyGoal = (int) Math.ceil((double) adjustedRemaining / remainingDays);

        int maxIncrease = (int)(todayPlanned * 1.2);
        if (newDailyGoal > maxIncrease) {
            newDailyGoal = maxIncrease;
        }

        if (newDailyGoal < 1) {
            newDailyGoal = 1;
        }

        return newDailyGoal;
    }
}
