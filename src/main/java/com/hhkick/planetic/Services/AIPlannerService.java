package com.hhkick.planetic.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hhkick.planetic.GoalDTO.AIPlanResponse;
import com.hhkick.planetic.GoalDTO.GoalRequestDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AIPlannerService {

    private final ChatClient chatClient;

    public AIPlannerService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public AIPlanResponse makePlan(GoalRequestDTO req) {

        // 1️⃣ AI에게 줄 프롬프트 구성
        String prompt = String.format("""
                너는 학습 분석 AI다.

                사용자의 학습 데이터를 분석해서 반드시 JSON으로만 응답해라.

                규칙:
                - risk는 "안전", "주의", "위험" 중 하나
                - advice는 사용자에게 줄 현실적인 학습 조언
                - newDailyGoal은 남은 기간 기준으로 현실적으로 재조정된 하루 목표

                데이터:
                총 목표: %d
                완료한 양: %d
                남은 날짜: %d
                오늘 계획: %d
                오늘 완료: %d

                반드시 아래 형식만 반환:

                {
                  "newDailyGoal": 숫자,
                  "risk": "안전|주의|위험",
                  "advice": "조언 내용"
                }
                """,
                req.getTotalGoal(),
                req.getCompletedSoFar(),
                req.getRemainingDays(),
                req.getTodayPlanned(),
                req.getTodayDone()
        );

        try {
            // 2️⃣ AI 호출
            String result =
                    chatClient.prompt()
                            .user(prompt)
                            .call()
                            .content();

            System.out.println("AI 응답: " + result);

            // 3️⃣ JSON 파싱
            ObjectMapper mapper = new ObjectMapper();

            return mapper.readValue(result, AIPlanResponse.class);

        } catch (Exception e) {
            throw new RuntimeException("AI 응답 처리 실패", e);
        }
    }
}