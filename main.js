document.addEventListener('DOMContentLoaded', () => {

/// 테스트 코드 - 삭제 해야함 ///
const TEST_MODE = true;

if (TEST_MODE) {

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", "testUser");

    localStorage.setItem("plans_testUser", JSON.stringify([
        {
            id: Date.now(),
            name: "알고리즘 문제 풀이",
            total: 10,
            dailyAmount: 5,
            unit: "문제",
            end: "2026-05-07",
            completed: false
        }
    ]));

    localStorage.removeItem("hiddenGoals_testUser");
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
    let plans =
        loadJSON(`plans_${userKey}`, []);

    plans.forEach(plan => {

        if (!plan.id) {

            plan.id =
                Date.now() + Math.random();
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
    function renderTodos() {

        todoListArea.innerHTML = "";

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

            if (hiddenGoals.includes(plan.id)) return;

            const dailyAmount =
                parseInt(plan.dailyAmount);

            const totalAmount =
                parseInt(plan.total);

            const subjDiv =
                document.createElement('div');

            subjDiv.className = 'subject-group';

            subjDiv.dataset.subjIndex = idx;

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

            let doneCount = 0;

            for (let i = 0; i < dailyAmount; i++) {

                const li =
                    document.createElement('li');

                li.className = 'task-item';

                li.innerHTML = `
                    <span>
                        ${plan.unit} ${i + 1}
                    </span>

                    <div class="check-box"></div>
                `;

                if (checkedToday[idx]?.[i]) {

                    li.classList.add('checked');

                    doneCount++;
                }

                ul.appendChild(li);
            }

            subjDiv.appendChild(header);

            subjDiv.appendChild(ul);

            todoListArea.appendChild(subjDiv);

            // =============================
            // 진행률 계산용
            // 오늘 체크 개수 / 전체 목표량
            // =============================
            totalVolumes[idx] = totalAmount;

            completedVolumes[idx] = doneCount;
        });
    }

    // =============================
    // 목표 렌더
    // =============================
    function renderGoals() {

        goalList.innerHTML = "";

        plans.forEach((plan) => {

            if (hiddenGoals.includes(plan.id)) return;

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

            li.classList.toggle('checked');

            const isChecked =
                li.classList.contains('checked');

            if (!checkedToday[subjIndex]) {

                checkedToday[subjIndex] = {};
            }

            checkedToday[subjIndex][itemIndex] =
                isChecked;

            localStorage.setItem(
                `checkedToday_${userKey}`,
                JSON.stringify(checkedToday)
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

            plans[completedGoalIndex].completed =
                true;

            localStorage.setItem(
                `plans_${userKey}`,
                JSON.stringify(plans)
            );

            const goalId =
                plans[completedGoalIndex].id;

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