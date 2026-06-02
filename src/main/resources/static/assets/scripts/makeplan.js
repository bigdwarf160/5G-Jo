document.addEventListener('DOMContentLoaded', () => {

    // =============================
    // 사용자 정보 가져오기
    // =============================
    const currentUser =
        sessionStorage.getItem('userName') ||
        localStorage.getItem('userName');

    // 로그인 안 되어있으면 로그인 페이지로 이동
    if (!currentUser) {

        alert("로그인이 필요합니다.");

        window.location.href = "login";

        return;
    }

    const userKey = currentUser.trim();

    const planForm =
        document.getElementById('planForm');

    const startDateInput =
        document.getElementById('startDate');

    const endDateInput =
        document.getElementById('endDate');

    const totalAmountInput =
        document.getElementById('totalAmount');

    const unitSelect =
        document.getElementById('unit');

    const studyTimeSelect =
        document.getElementById('studyTime');

    const previewList =
        document.getElementById('planPreviewList');

    const resTotal =
        document.getElementById('resTotal');

    const resPeriod =
        document.getElementById('resPeriod');

    const resTime =
        document.getElementById('resTime');

    const resDaily =
        document.getElementById('resDaily');

    // 공부 시간 옵션 자동 생성 (30분 단위)
    for (let i = 0.5; i <= 12; i += 0.5) {

        const opt =
            document.createElement('option');

        opt.value = i;

        const h = Math.floor(i);

        const m =
            (i % 1 === 0.5)
                ? '30분'
                : '';

        opt.textContent =
            (h > 0 ? h + '시간 ' : '') + m;

        if (i === 2) {
            opt.selected = true;
        }

        studyTimeSelect.appendChild(opt);
    }

    // 기본 시작일 설정 (오늘)
    startDateInput.value =
        new Date()
            .toISOString()
            .split('T')[0];

    // =============================
    // 계획 자동 계산 + 미리보기
    // =============================
    function updatePlan() {

        const start =
            new Date(startDateInput.value);

        const end =
            new Date(endDateInput.value);

        const total =
            parseInt(totalAmountInput.value) || 0;

        const unit =
            unitSelect.value;

        const time =
            parseFloat(studyTimeSelect.value);

        document
            .querySelectorAll('.resUnitText')
            .forEach(el => {
                el.textContent = unit;
            });

        resTotal.textContent = total;

        resTime.textContent =
            (time % 1 === 0.5)
                ? time
                : Math.floor(time);

        // 유효한 입력일 때만 계산
        if (
            !isNaN(start.getTime()) &&
            !isNaN(end.getTime()) &&
            end >= start &&
            total > 0
        ) {

            const days =
                Math.ceil(
                    (end - start) /
                    (1000 * 60 * 60 * 24)
                ) + 1;

            const dailyAmount =
                Math.ceil(total / days);

            resPeriod.textContent = days;

            resDaily.textContent =
                dailyAmount;

            // 미리보기 리스트 생성
            previewList.innerHTML = '';

            let currentIdx = 1;

            for (let i = 0; i < days; i++) {

                const currentDate =
                    new Date(start);

                currentDate.setDate(
                    start.getDate() + i
                );

                const dateStr =
                    `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;

                const startRange =
                    currentIdx;

                const endRange =
                    Math.min(
                        currentIdx +
                        dailyAmount - 1,
                        total
                    );

                const li =
                    document.createElement('li');

                li.innerHTML = `
                    <strong>${dateStr}</strong>
                    <span>
                        ${startRange} ~ ${endRange} ${unit}
                    </span>
                `;

                previewList.appendChild(li);

                currentIdx += dailyAmount;

                if (currentIdx > total) {
                    break;
                }
            }

        } else {

            resPeriod.textContent = '0';

            resDaily.textContent = '0';

            previewList.innerHTML = `
                <li class="empty-msg">
                    기간과 분량을 입력하면
                    계획이 생성됩니다.
                </li>
            `;
        }
    }

    // =============================
    // 계획 저장
    // =============================
    planForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        // 날짜 값 가져오기
        const start =
            new Date(startDateInput.value);

        const end =
            new Date(endDateInput.value);

        // 날짜 입력 확인
        if (
            !startDateInput.value ||
            !endDateInput.value
        ) {

            alert(
                "시작일과 종료일을 입력해주세요."
            );

            return;
        }

        // 날짜 유효성 검사
        if (
            isNaN(start.getTime()) ||
            isNaN(end.getTime())
        ) {

            alert(
                "올바른 날짜를 입력해주세요."
            );

            return;
        }

        // 종료일 검사
        if (end < start) {

            alert(
                "종료일은 시작일보다 늦어야 합니다."
            );

            return;
        }

        // 총 분량 검사
        const totalValue =
            parseInt(totalAmountInput.value);

        if (
            isNaN(totalValue) ||
            totalValue <= 0
        ) {

            alert(
                "총 분량은 1 이상 입력하세요."
            );

            return;
        }

        // =============================
        // 목표 이름 검사
        // =============================
        const goalName =
            document
                .getElementById('goalName')
                .value
                .trim();

        // 빈 문자열 방지
        if (!goalName) {

            alert(
                "목표 이름을 입력해주세요."
            );

            return;
        }

        // 길이 제한
        if (goalName.length > 20) {

            alert(
                "목표 이름은 20자 이하로 입력해주세요."
            );

            return;
        }

        // 사용자별 데이터 불러오기
        let plans =
            JSON.parse(
                localStorage.getItem(
                    `plans_${userKey}`
                )
            ) || [];

        // 중복 목표 이름 방지
        const isDuplicate =
            plans.some(
                plan =>
                    plan.name === goalName
            );

        if (isDuplicate) {

            alert(
                "이미 존재하는 목표 이름입니다."
            );

            return;
        }

        // 목표 데이터 생성
        const goalData = {

            id:
                Date.now() + Math.random(),

            name:
            goalName,

            type:
            document
                .getElementById('goalType')
                .value,

            total:
            totalValue,

            unit:
            unitSelect.value,

            start:
            startDateInput.value,

            end:
            endDateInput.value,

            dailyTime:
            studyTimeSelect.value,

            dailyAmount:
                parseInt(
                    resDaily.textContent
                ),

            completed:
                false
        };

        // 저장
        try {

            const response =
                await fetch(
                    "http://localhost:8080/goal/create",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            goalName:
                            goalName,

                            goalType:
                            document
                                .getElementById('goalType')
                                .value,

                            totalAmount:
                            totalValue,

                            unit:
                            unitSelect.value,

                            startDate:
                            startDateInput.value,

                            endDate:
                            endDateInput.value,

                            studyTime:
                            studyTimeSelect.value,

                            dailyGoal:
                                parseInt(
                                    resDaily.textContent
                                ),

                            userName:
                            userKey
                        })
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "목표 저장 실패"
                );
            }

            alert("목표 생성 완료!");

            window.location.href =
                "main";

        } catch (error) {

            console.error(error);

            alert(
                "서버 연결 실패"
            );
        }
    });

    // 입력값 변경 시 실시간 업데이트
    [
        startDateInput,
        endDateInput,
        totalAmountInput,
        unitSelect,
        studyTimeSelect
    ].forEach(el => {

        el.addEventListener(
            'input',
            updatePlan
        );
    });

    updatePlan();
});