document.addEventListener('DOMContentLoaded', () => {

/// 여기까지

    // =============================
    // 로그인
    // =============================
    const isLoggedInSession =
        sessionStorage.getItem('isLoggedIn') === 'true';

    const userNameSession =
        sessionStorage.getItem('userName');

    const isLoggedInLocal =
        localStorage.getItem('isLoggedIn') === 'true';

    const userNameLocal =
        localStorage.getItem('userName');

    let currentUser = null;

    if (isLoggedInSession && userNameSession) {

        currentUser = userNameSession;

    } else if (isLoggedInLocal && userNameLocal) {

        currentUser = userNameLocal;

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userName', currentUser);
    }

    // 로그인 안된 경우
    if (!currentUser) {

        window.location.href = 'login';
        return;
    }

    // =============================
    // 로그아웃
    // =============================
    document.getElementById('logoutBtn')?.addEventListener('click', () => {

        sessionStorage.clear();

        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');

        window.location.href = 'login';
    });

    // =============================
    // 목표 생성 버튼
    // =============================
    const createBtn = document.getElementById('createGoalBtn');

    if (createBtn) {

        createBtn.addEventListener('click', () => {

            window.location.href = "makeplan";
        });
    }

    // =============================
    // 포인트
    // =============================
    let currentPoints = 4583;

    document.getElementById('userPoints').textContent =
        currentPoints + "점";

    const userKey = currentUser.trim();

    // =============================
    // 사용자 이름 출력
    // =============================
    const welcomeEl =
        document.querySelector('.user-welcome strong');

    if (welcomeEl) {

        welcomeEl.textContent = currentUser;
    }

    // =============================
    // JSON 안전 로드
    // =============================
    function loadJSON(key, defaultValue) {

        try {

            const data = localStorage.getItem(key);

            return data
                ? JSON.parse(data)
                : defaultValue;

        } catch (e) {

            console.error(`${key} 데이터 오류`, e);

            return defaultValue;
        }
    }

    // =============================
    // 상태 변수
    // =============================
    let plans = [];

    async function loadGoals() {

        try {

            const response =
                await fetch(
                    `http://localhost:8080/goal/user/${userKey}`
                );

            if (!response.ok) {

                throw new Error(
                    "목표 조회 실패"
                );
            }

            plans =
                await response.json();

            console.log(
                "불러온 목표:",
                plans
            );

            totalVolumes.length = 0;
            completedVolumes.length = 0;

            renderAll();

        } catch(error) {

            console.error(error);

            alert("목표 불러오기 실패");
        }
    }

    let hiddenGoals =
        loadJSON(`hiddenGoals_${userKey}`, []);

    let checkedToday =
        loadJSON(`checkedToday_${userKey}`, {});

    let completedGoalIndex = null;
    let modalShown = false;

    const todoListArea =
        document.getElementById('todoListArea');

    const goalList =
        document.getElementById('goalList');

    const successModal =
        document.getElementById('successModal');

    const successMessage =
        document.getElementById('successMessage');

    const closeModalBtn =
        document.getElementById('closeModalBtn');

    // =============================
    // 위험도 요소
    // =============================
    const riskStatus =
        document.getElementById('riskStatus');

    const riskAlert =
        document.getElementById('riskAlert');

    const riskTooltip =
        document.getElementById('riskTooltip');

    const riskCircle =
        document.querySelector('.risk-circle');

    // =============================
    // 오늘의 나 평가 요소
    // =============================
    const saveEvalBtn =
        document.getElementById('saveEvalBtn');

    const avgScore =
        document.getElementById('avgScore');

    // =============================
    // 진행률 배열
    // =============================
    const totalVolumes = [];
    const completedVolumes = [];

    const todayStr =
        new Date().toISOString().slice(0, 10);

    // =============================
    // 날짜 변경 시 초기화
    // =============================
    const lastDate =
        localStorage.getItem(`lastDate_${userKey}`);

    if (lastDate !== todayStr) {

        checkedToday = {};

        localStorage.setItem(
            `lastDate_${userKey}`,
            todayStr
        );

        localStorage.setItem(
            `checkedToday_${userKey}`,
            JSON.stringify(checkedToday)
        );
    }

    // =============================
    // 전체 렌더
    // =============================
    function renderAll() {

        renderTodos();

        renderGoals();

        renderProgressBars();

        updateUI();

        renderEvaluation();
    }

    // =============================
    // 할 일 렌더
    // =============================
    console.log("renderTodos 실행됨", plans);
    function renderTodos() {

        todoListArea.innerHTML = "";

        totalVolumes.length = 0;
        completedVolumes.length = 0;

        if (plans.length === 0) {

            todoListArea.innerHTML = `
            <p style="padding:20px;">
                현재 등록된 목표가 없습니다 😢<br>
                목표를 먼저 생성해주세요!
            </p>
        `;

            return;
        }

        plans.forEach((plan, idx) => {

            // 숨김 목표 제외
            if (
                hiddenGoals.includes(
                    plan.goalId
                )
            ) return;

            const totalAmount =
                parseInt(
                    plan.totalAmount || 0
                );

            const completedAmount =
                parseInt(
                    plan.completedAmount || 0
                );

            const start =
                new Date(
                    plan.startDate
                );

            const end =
                new Date(
                    plan.endDate
                );

            // 목표 기간 계산
            const days =
                Math.max(
                    1,
                    Math.ceil(
                        (
                            end - start
                        ) /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        )
                    ) + 1
                );

            // 하루 목표량 계산
            const dailyAmount =
                plan.dailyGoal
                    ? plan.dailyGoal
                    : Math.max(
                        1,
                        Math.ceil(
                            totalAmount / days
                        )
                    );

            const subjDiv =
                document.createElement(
                    "div"
                );

            subjDiv.className =
                "subject-group";

            subjDiv.dataset.goalId =
                plan.goalId;

            const header =
                document.createElement(
                    "div"
                );

            header.className =
                "subj-header";

            const progress =
                totalAmount === 0
                    ? 0
                    : Math.round(
                        (
                            completedAmount /
                            totalAmount
                        ) * 100
                    );


            header.innerHTML = `
<span class="subj-name">
    ${plan.goalName}
</span>

<span class="subj-score">
    진행률 ${progress}% <br>
    AI 목표 ${plan.dailyGoal}
</span>

<div class="ai-box">
    <div>위험도: ${plan.risk}</div>
    <div>조언: ${plan.advice}</div>
</div>
`;

            const ul =
                document.createElement(
                    "ul"
                );

            ul.className =
                "task-list";

            let doneCount = 0;

            for (
                let i = 0;
                i < dailyAmount;
                i++
            ) {

                const li =
                    document.createElement(
                        "li"
                    );

                li.className =
                    "task-item";

                li.dataset.goalId =
                    plan.goalId;

                li.dataset.index =
                    i;

                li.innerHTML = `
                <span>
                    문제 ${i + 1}
                </span>

                <div class="check-box"></div>
            `;

                // goalId 기준 체크
                if (
                    checkedToday[
                        plan.goalId
                        ]?.[i]
                ) {

                    li.classList.add(
                        "checked"
                    );

                    doneCount++;
                }

                ul.appendChild(li);
            }

            subjDiv.appendChild(
                header
            );

            subjDiv.appendChild(
                ul
            );

            todoListArea.appendChild(
                subjDiv
            );

            totalVolumes[idx] =
                totalAmount;

            completedVolumes[idx] =
                completedAmount;
        });
    }

    // =============================
    // 목표 렌더
    // =============================
    function renderGoals() {

        goalList.innerHTML = "";

        plans.forEach((plan) => {

            if (
                hiddenGoals.includes(
                    plan.goalId
                )
            ) return;

            const li =
                document.createElement('li');

            li.className = "goal-item";

            const today = new Date();

            const due =
                new Date(plan.endDate);

            const diff = Math.ceil(
                (due - today) /
                (1000 * 60 * 60 * 24)
            );

            const dday =
                diff > 0 ? `D-${diff}` :
                    diff === 0 ? "D-Day" :
                        `D+${Math.abs(diff)}`;

            li.innerHTML = `
                <span class="goal-name">
                    ${plan.goalName}
                </span>

                <span class="goal-dday">
                    ${dday}
                </span>
            `;

            goalList.appendChild(li);
        });
    }

    // =============================
    // 진행률 바
    // =============================
    function renderProgressBars() {

        const container =
            document.getElementById("progressCard");

        if (!container) return;

        container.innerHTML = "";

        plans.forEach((plan, i) => {

            if (hiddenGoals.includes(plan.goalId)) return;

            const done =
                completedVolumes[i] || 0;

            const total =
                totalVolumes[i] || 1;

            const pct =
                Math.round((done / total) * 100);

            const div =
                document.createElement("div");

            div.className = "prog-item";

            div.innerHTML = `
                <span class="prog-name">
                    ${plan.goalName}
                </span>

                <div class="bar-container">
                    <div
                        class="bar-fill"
                        style="width:${pct}%">
                    </div>
                </div>

                <span class="prog-num">
                    ${pct}%
                </span>
            `;

            container.appendChild(div);
        });
    }

    // =============================
    // UI 업데이트
    // =============================
    function updateUI() {

        let totalPct = 0;

        let visibleCount = 0;

        let dangerList = [];

        plans.forEach((plan, i) => {

            if (hiddenGoals.includes(plan.goalId)) return;

            visibleCount++;

            const total =
                totalVolumes[i] || 1;

            const done =
                completedVolumes[i] || 0;

            const pct =
                Math.round((done / total) * 100);

            const originalDailyGoal =
                Math.max(
                    1,
                    Math.ceil(
                        total /
                        Math.max(
                            1,
                            Math.ceil(
                                (
                                    new Date(plan.endDate) -
                                    new Date(plan.startDate)
                                ) /
                                (1000 * 60 * 60 * 24)
                            ) + 1
                        )
                    )
                );

            const aiIncrease =
                plan.dailyGoal -
                originalDailyGoal;

            if (
                pct === 100 &&
                !plan.completed &&
                !modalShown
            ) {

                modalShown = true;

                completedGoalIndex = i;

                successMessage.textContent =
                    `${plan.goalName} 목표를 완료했어요!`;

                successModal.style.display = 'flex';
            }

            const el =
                document.querySelector(
                    `.subject-group[data-goal-id="${plan.goalId}"] .subj-score`
                );

            if (el) {

                el.textContent =
                    `목표 + ${pct}%`;
            }

            let riskScore = pct;

// AI가 목표를 많이 올렸으면 위험도 증가
            riskScore -= aiIncrease * 5;

            if (riskScore < 40) {

                dangerList.push(plan.goalName);
            }

            totalPct += riskScore;

            totalPct += pct;
        });

        if (
            !riskStatus ||
            !riskAlert ||
            !riskTooltip ||
            !riskCircle
        ) return;

        if (visibleCount === 0) {

            riskStatus.textContent = "목표 없음";

            riskAlert.style.display = "none";

            riskTooltip.innerHTML = "";

            riskCircle.style.borderColor = "#cccccc";

            return;
        }

        const avg =
            totalPct / visibleCount;

        if (avg >= 75) {

            riskStatus.textContent = "안전";

            riskAlert.style.display = "none";

            riskTooltip.innerHTML = "";

            riskCircle.style.borderColor = "#6F9B73";

        } else if (avg >= 40) {

            riskStatus.textContent = "주의";

            riskAlert.style.display = "flex";

            riskTooltip.innerHTML = `
                현재 <strong>
                ${dangerList.join(", ")}
                </strong> 과목이 주의 단계입니다.
            `;

            riskCircle.style.borderColor = "#FFA94D";

        } else {

            riskStatus.textContent = "위험";

            riskAlert.style.display = "flex";

            riskTooltip.innerHTML = `
                현재 <strong>
                ${dangerList.join(", ")}
                </strong> 과목이 위험 단계입니다.
            `;

            riskCircle.style.borderColor = "#FF5A5A";
        }
    }

    // =============================
// 체크 이벤트
// =============================
    document.addEventListener(
        'click',
        async (e) => {

            if (
                !e.target.classList.contains(
                    'check-box'
                )
            ) return;

            const li =
                e.target.closest(
                    '.task-item'
                );

            const subj =
                e.target.closest(
                    '.subject-group'
                );

            if (
                !li ||
                !subj
            ) return;

            const goalId =
                parseInt(
                    subj.dataset.goalId
                );

            const itemIndex =
                parseInt(
                    li.dataset.index
                );

            li.classList.toggle(
                'checked'
            );

            const isChecked =
                li.classList.contains(
                    'checked'
                );

            // 체크 저장
            if (
                !checkedToday[
                    goalId
                    ]
            ) {

                checkedToday[
                    goalId
                    ] = {};
            }

            checkedToday[
                goalId
                ][itemIndex] =
                isChecked;

            localStorage.setItem(
                `checkedToday_${userKey}`,
                JSON.stringify(
                    checkedToday
                )
            );

            // =====================
            // 완료량 재계산
            // =====================
            const checkedCount =
                Object.values(
                    checkedToday[goalId] || {}
                )
                    .filter(v => v)
                    .length;

            const plan =
                plans.find(
                    p => p.goalId === goalId
                );

            if (!plan) return;

// AI 계산용 기존 완료량 저장
            const previousCompleted =
                plan.completedAmount;

// 현재 체크 상태 반영
            plan.completedAmount =
                checkedCount;

            try {

                // 진행률 저장
                await fetch(
                    `http://localhost:8080/goal/${goalId}/progress`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            completedAmount:
                            checkedCount
                        })
                    }
                );

                // 하루 목표량 계산
                const startDate =
                    new Date(plan.startDate);

                const endDate =
                    new Date(plan.endDate);

                const totalDays =
                    Math.max(
                        1,
                        Math.ceil(
                            (endDate - startDate) /
                            (1000 * 60 * 60 * 24)
                        ) + 1
                    );

                const dailyAmount =
                    Math.max(
                        1,
                        Math.ceil(
                            plan.totalAmount /
                            totalDays
                        )
                    );

                // 남은 날짜 계산
                const today =
                    new Date();

                const remainingDays =
                    Math.max(
                        1,
                        Math.ceil(
                            (endDate - today) /
                            (1000 * 60 * 60 * 24)
                        )
                    );

                // AI 재계획 요청
                const response = await fetch(
                    "http://localhost:8080/goal/recalculate-ai",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            totalGoal: plan.totalAmount,
                            completedSoFar: checkedCount,
                            remainingDays: remainingDays,
                            todayPlanned: dailyAmount,
                            todayDone: checkedCount
                        })
                    }
                );

                const ai = await response.json();

// 🔥 DB에는 dailyGoal만 저장
                await fetch(
                    `http://localhost:8080/goal/${goalId}/daily-goal`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            dailyGoal: ai.newDailyGoal
                        })
                    }
                );

// 🔥 프론트 상태에 AI 결과 유지
                plan.dailyGoal = ai.newDailyGoal;
                plan.risk = ai.risk;
                plan.advice = ai.advice;

// ❌ loadGoals() 쓰지 마
                renderTodos();
                updateUI();

                console.log("AI 결과:", ai);

            } catch(err) {

                console.error(
                    "AI 재계획 오류",
                    err
                );
            }

            plans.forEach(p => console.log(p.dailyGoal));
        }
    );

    // =============================
    // 오늘의 나 평가
    // =============================
    let selectedScore = 0;

    document.querySelectorAll('.num-btn').forEach(btn => {

        btn.addEventListener('click', () => {

            selectedScore =
                parseInt(btn.dataset.val);

            document
                .querySelectorAll('.num-btn')
                .forEach(b =>
                    b.classList.remove('active')
                );

            btn.classList.add('active');
        });
    });

    saveEvalBtn?.addEventListener('click', () => {

        if (selectedScore === 0) {

            alert("점수를 선택하세요!");

            return;
        }

        let evalData =
            loadJSON(
                `dailyEvaluation_${userKey}`,
                {}
            );

        evalData[todayStr] = selectedScore;

        localStorage.setItem(
            `dailyEvaluation_${userKey}`,
            JSON.stringify(evalData)
        );

        renderEvaluation();

        alert("평가 저장 완료!");
    });

    // =============================
    // 평가 평균 렌더
    // =============================
    function renderEvaluation() {

        if (!avgScore) return;

        const evalData =
            loadJSON(
                `dailyEvaluation_${userKey}`,
                {}
            );

        const values =
            Object.values(evalData);

        let avg = 0;

        if (values.length > 0) {

            avg = (
                values.reduce((a, b) => a + b, 0)
                / values.length
            ).toFixed(1);
        }

        avgScore.textContent = avg;
    }

    // =============================
    // 위험도 툴팁
    // =============================
    riskAlert?.addEventListener('click', (e) => {

        e.stopPropagation();

        riskTooltip?.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {

        if (
            riskAlert &&
            !riskAlert.contains(e.target)
        ) {

            riskTooltip?.classList.remove('show');
        }
    });

    // =============================
    // 모달 닫기
    // =============================
    closeModalBtn?.addEventListener('click', () => {

        successModal.style.display = 'none';

        modalShown = false;

        if (
            typeof completedGoalIndex === "number"
        ) {
            const goalId =
                plans[
                    completedGoalIndex
                    ].goalId;

            if (
                !hiddenGoals.includes(
                    goalId
                )
            ) {

                hiddenGoals.push(goalId);

                localStorage.setItem(
                    `hiddenGoals_${userKey}`,
                    JSON.stringify(
                        hiddenGoals
                    )
                );
            }

            completedGoalIndex = null;

            renderAll();
        }
    });

    // =============================
    // 초기 실행
    // =============================
    loadGoals();

});