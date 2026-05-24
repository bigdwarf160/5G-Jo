document.addEventListener('DOMContentLoaded', () => {

/// 테스트 코드 - 추후 삭제 해야함 ///
const TEST_MODE = true;

if (TEST_MODE) {

    // 기존 데이터 없을 때만 생성
    if (!localStorage.getItem("plans_testUser")) {

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", "testUser");

        localStorage.setItem("plans_testUser", JSON.stringify([
            {
                id: Date.now(),
                name: "알고리즘 문제 풀이",
                total: 5,
                dailyAmount: 5,
                unit: "문제",
                startDate: "2026-05-14",
                end: "2026-05-20",
                completed: false
            }
        ]));
    }
}
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

        window.location.href = 'login.html';
        return;
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
    // 회원 가입 후 최초 사용자 -> 목표 생성 페이지 이동
    // =============================
    const userKey = currentUser.trim();

    let plans =
        loadJSON(`plans_${userKey}`, []);

    if (plans.length === 0) {

        window.location.href = 'makeplan.html';
        return;
    }

    // =============================
    // 저장된 테마 적용
    // =============================
    const savedTheme =
        localStorage.getItem(`theme_${userKey}`);

    if (savedTheme) {

        document.body.classList.add(savedTheme);
    }

    // =============================
    // 로그아웃
    // =============================
    document.getElementById('logoutBtn')?.addEventListener('click', () => {

        sessionStorage.clear();

        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');

        window.location.href = 'login.html';
    });

    // =============================
    // 목표 생성 버튼
    // =============================
    const createBtn = document.getElementById('createGoalBtn');

    if (createBtn) {

        createBtn.addEventListener('click', () => {

            window.location.href = "makeplan.html";
        });
    }

    // =============================
    // 포인트
    // =============================
    let currentPoints = Number(
        localStorage.getItem(`points_${userKey}`)
    );

    if (isNaN(currentPoints)) {

        currentPoints = 0;

        localStorage.setItem(
            `points_${userKey}`,
            currentPoints
        );
    }

    function updatePointUI() {

        const pointEl =
            document.getElementById('userPoints');

        if (pointEl) {

            pointEl.textContent =
                currentPoints + "점";
        }
    }

    updatePointUI();

    // =============================
    // 포인트 지급
    // =============================
    function addPoints(amount) {

        amount = Number(amount) || 0;

        currentPoints += amount;

        localStorage.setItem(
            `points_${userKey}`,
            currentPoints
        );

        updatePointUI();
    }

    // =============================
    // 사용자 이름 출력
    // =============================
    const welcomeEl =
        document.querySelector('.user-welcome strong');

    if (welcomeEl) {

        welcomeEl.textContent = currentUser;
    }

    // =============================
    // 상태 변수
    // =============================
    plans.forEach(plan => {

        if (!plan.id) {

            plan.id =
                Date.now() + Math.random();
        }

        if (!plan.startDate) {

            plan.startDate =
                new Date().toISOString().slice(0, 10);
        }
    });

    localStorage.setItem(
        `plans_${userKey}`,
        JSON.stringify(plans)
    );

    let hiddenGoals =
        loadJSON(`hiddenGoals_${userKey}`, []);

    let checkedToday =
        loadJSON(`checkedToday_${userKey}`, {});

    let progressData =
        loadJSON(`progress_${userKey}`, {});

    let countedTasks =
        loadJSON(`countedTasks_${userKey}`, {});

    let rewardedGoals =
        loadJSON(`rewardedGoals_${userKey}`, []);

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

    const riskStatus =
        document.getElementById('riskStatus');

    const riskAlert =
        document.getElementById('riskAlert');

    const riskTooltip =
        document.getElementById('riskTooltip');

    const riskCircle =
        document.querySelector('.risk-circle');

    const saveEvalBtn =
        document.getElementById('saveEvalBtn');

    const avgScore =
        document.getElementById('avgScore');

    const totalVolumes = [];

    const completedVolumes = [];

    const todayStr =
        new Date().toISOString().slice(0, 10);

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
    // 포인트 클릭 -> 테마 이동 (추가)
    // =============================
    const pointBox =
        document.querySelector('.point-box');

    if (pointBox) {

        pointBox.style.cursor = "pointer";

        pointBox.addEventListener('click', () => {

            window.location.href = "theme.html";
        });
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
    function renderTodos() {

        todoListArea.innerHTML = "";

        const visiblePlans = plans
            .map((plan, index) => ({plan, index}))
            .filter(item =>
                !hiddenGoals.includes(item.plan.id)
            );

        if (visiblePlans.length === 0) {

            todoListArea.innerHTML = `
                <p style="
                    padding:20px;
                    text-align:center;
                ">
                    현재 모든 목표가 완료되었습니다.<br>
                    새로운 목표를 생성해주세요!
                </p>
            `;

            return;
        }

        visiblePlans.forEach(({plan, index}) => {

            const dailyAmount =
                parseInt(plan.dailyAmount);

            const totalAmount =
                parseInt(plan.total);

            const startDate =
                new Date(plan.startDate);

            const today =
                new Date();

            const diffDays =
                Math.floor(
                    (today - startDate) /
                    (1000 * 60 * 60 * 24)
                );

            const startNum =
                diffDays * dailyAmount + 1;

            const subjDiv =
                document.createElement('div');

            subjDiv.className = 'subject-group';

            subjDiv.dataset.subjIndex = index;

            const header =
                document.createElement('div');

            header.className = 'subj-header';

            header.innerHTML = `
                <span class="subj-name">
                    ${plan.name}
                </span>

                <span class="subj-score">
                    목표 + 0%
                </span>
            `;

            const ul =
                document.createElement('ul');

            ul.className = 'task-list';

            for (let i = 0; i < dailyAmount; i++) {

                const currentNum =
                    startNum + i;

                if (currentNum > totalAmount) break;

                const li =
                    document.createElement('li');

                li.className = 'task-item';

                li.innerHTML = `
                    <span>
                        ${plan.unit} ${currentNum}
                    </span>

                    <div class="check-box"></div>
                `;

                if (checkedToday[index]?.[i]) {

                    li.classList.add('checked');
                }

                ul.appendChild(li);
            }

            subjDiv.appendChild(header);

            subjDiv.appendChild(ul);

            todoListArea.appendChild(subjDiv);

            totalVolumes[index] =
                totalAmount;

            completedVolumes[index] =
                progressData[plan.id] || 0;
        });
    }

    // =============================
    // 목표 렌더
    // =============================
    function renderGoals() {

        goalList.innerHTML = "";

        plans.forEach((plan) => {

            if (hiddenGoals.includes(plan.id))
                return;

            const li =
                document.createElement('li');

            li.className = "goal-item";

            const today = new Date();

            const due =
                new Date(plan.end);

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
                    ${plan.name}
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

            if (hiddenGoals.includes(plan.id)) return;

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
                    ${plan.name}
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

            if (hiddenGoals.includes(plan.id)) return;

            visibleCount++;

            const total =
                totalVolumes[i] || 1;

            const done =
                completedVolumes[i] || 0;

            const pct =
                Math.round((done / total) * 100);

            if (
                pct === 100 &&
                !plan.completed &&
                !modalShown
            ) {

                modalShown = true;

                completedGoalIndex = i;

                successMessage.textContent =
                    `${plan.name} 목표를 완료했어요!`;

                successModal.style.display = 'flex';
            }

            const el = document.querySelector(
                `.subject-group[data-subj-index="${i}"] .subj-score`
            );

            if (el) {

                el.textContent =
                    `목표 + ${pct}%`;
            }

            if (pct < 40) {

                dangerList.push(plan.name);
            }

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
    document.addEventListener('click', (e) => {

        if (
            e.target.classList.contains('check-box')
        ) {

            const li =
                e.target.closest('.task-item');

            const subj =
                e.target.closest('.subject-group');

            if (!li || !subj) return;

            const subjIndex =
                parseInt(subj.dataset.subjIndex);

            const itemIndex =
                Array.from(li.parentNode.children)
                .indexOf(li);

            const plan =
                plans[subjIndex];

            const planId =
                plan.id;

            const taskKey =
                `${todayStr}_${itemIndex}`;

            if (li.classList.contains('checked')) {

                li.classList.remove('checked');

                if (checkedToday[subjIndex]) {

                    checkedToday[subjIndex][itemIndex] = false;
                }

            } else {

                li.classList.add('checked');

                if (!checkedToday[subjIndex]) {

                    checkedToday[subjIndex] = {};
                }

                checkedToday[subjIndex][itemIndex] = true;

                if (!progressData[planId]) {

                    progressData[planId] = 0;
                }

                if (!countedTasks[planId]) {

                    countedTasks[planId] = {};
                }

                if (!countedTasks[planId][taskKey]) {

                    countedTasks[planId][taskKey] = true;

                    if (!plan.completed) {

                        progressData[planId]++;
                    }
                }

                const total =
                    parseInt(plan.total);

                if (progressData[planId] > total) {

                    progressData[planId] = total;
                }
            }

            localStorage.setItem(
                `checkedToday_${userKey}`,
                JSON.stringify(checkedToday)
            );

            localStorage.setItem(
                `progress_${userKey}`,
                JSON.stringify(progressData)
            );

            localStorage.setItem(
                `countedTasks_${userKey}`,
                JSON.stringify(countedTasks)
            );

            renderAll();
        }
    });

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

            const completedPlan =
                plans[completedGoalIndex];

            completedPlan.completed = true;

            const goalId =
                completedPlan.id;

            if (!rewardedGoals.includes(goalId)) {

                addPoints(100);

                rewardedGoals.push(goalId);

                localStorage.setItem(
                    `rewardedGoals_${userKey}`,
                    JSON.stringify(rewardedGoals)
                );
            }

            localStorage.setItem(
                `plans_${userKey}`,
                JSON.stringify(plans)
            );

            if (!hiddenGoals.includes(goalId)) {

                hiddenGoals.push(goalId);

                localStorage.setItem(
                    `hiddenGoals_${userKey}`,
                    JSON.stringify(hiddenGoals)
                );
            }

            completedGoalIndex = null;

            renderAll();
        }
    });

    // =============================
    // 초기 실행
    // =============================
    renderAll();

});