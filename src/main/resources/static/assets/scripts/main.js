document.addEventListener('DOMContentLoaded', () => {
/// 테스트 코드 - 삭제 해야함 ///
    const TEST_MODE = true;

    if (TEST_MODE) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", "testUser");

        localStorage.setItem("plans_testUser", JSON.stringify([
            {
                name: "테스트과목",
                total: 1,
                dailyAmount: 1,
                unit: "문제",
                end: "2026-05-10",
                completed: false
            }
        ]));

        localStorage.removeItem("hiddenGoals_testUser");
    }
/// 여기까지

    // =============================
    // 로그인
    // =============================
    const isLoggedInSession = sessionStorage.getItem('isLoggedIn') === 'true';
    const userNameSession = sessionStorage.getItem('userName');

    const isLoggedInLocal = localStorage.getItem('isLoggedIn') === 'true';
    const userNameLocal = localStorage.getItem('userName');

    let currentUser = null;

    if (isLoggedInSession && userNameSession) {
        currentUser = userNameSession;
    } else if (isLoggedInLocal && userNameLocal) {
        currentUser = userNameLocal;
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userName', currentUser);
    }

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const userKey = currentUser.trim();

    document.querySelector('.user-welcome strong').textContent = currentUser;

    // =============================
    // 상태 변수
    // =============================
    let plans = JSON.parse(localStorage.getItem(`plans_${userKey}`)) || [];
    let hiddenGoals = JSON.parse(localStorage.getItem(`hiddenGoals_${userKey}`)) || [];
    hiddenGoals = hiddenGoals.map(Number);

    let completedGoalIndex = null;
    let modalShown = false;

    const todoListArea = document.getElementById('todoListArea');
    const goalList = document.getElementById('goalList');

    const totalVolumes = [];
    const completedVolumes = [];

    const todayStr = new Date().toISOString().slice(0, 10);

    let checkedToday = JSON.parse(localStorage.getItem(`checkedToday_${userKey}`)) || {};

    // 날짜 변경 시 초기화
    const lastDate = localStorage.getItem(`lastDate_${userKey}`);
    if (lastDate !== todayStr) {
        checkedToday = {};
        localStorage.setItem(`lastDate_${userKey}`, todayStr);
        localStorage.setItem(`checkedToday_${userKey}`, JSON.stringify(checkedToday));
    }

    // =============================
    // 렌더 공통 함수 (핵심)
    // =============================
    function renderAll() {
        renderTodos();
        renderGoals();
        updateUI();
    }

    // =============================
    // 할 일 렌더
    // =============================
    function renderTodos() {

        todoListArea.innerHTML = "";

        if (plans.length === 0) {
            todoListArea.innerHTML =
                `<p style="padding:20px;">목표가 없습니다 😢<br>목표를 먼저 생성해주세요!</p>`;
            return;
        }

        plans.forEach((plan, idx) => {

            if (hiddenGoals.includes(idx)) return;

            const subjDiv = document.createElement('div');
            subjDiv.className = 'subject-group';
            subjDiv.dataset.subjIndex = idx;

            const header = document.createElement('div');
            header.className = 'subj-header';
            header.innerHTML = `
                <span class="subj-name">${plan.name}</span>
                <span class="subj-score">목표 + 0%</span>
            `;

            const ul = document.createElement('ul');
            ul.className = 'task-list';

            let doneCount = 0;

            for (let i = 0; i < parseInt(plan.dailyAmount); i++) {

                const li = document.createElement('li');
                li.className = 'task-item';
                li.innerHTML = `<span>${plan.unit} ${i + 1}</span><div class="check-box"></div>`;

                if (checkedToday[idx]?.[i]) {
                    li.classList.add('checked');
                    doneCount++;
                }

                ul.appendChild(li);
            }

            subjDiv.appendChild(header);
            subjDiv.appendChild(ul);
            todoListArea.appendChild(subjDiv);

            totalVolumes[idx] = parseInt(plan.total);
            completedVolumes[idx] = doneCount;
        });
    }

    // =============================
    // 목표 렌더
    // =============================
    function renderGoals() {

        goalList.innerHTML = "";

        plans.forEach((plan, idx) => {

            if (hiddenGoals.includes(idx)) return;

            const li = document.createElement('li');
            li.className = "goal-item";

            const today = new Date();
            const due = new Date(plan.end);
            const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

            const dday =
                diff > 0 ? `D-${diff}` :
                    diff === 0 ? "D-Day" :
                        `D+${Math.abs(diff)}`;

            li.innerHTML = `
                <span class="goal-name">${plan.name}</span>
                <span class="goal-dday">${dday}</span>
            `;

            goalList.appendChild(li);
        });
    }

    // =============================
    // UI 업데이트
    // =============================
    function updateUI() {

        let totalPct = 0;

        plans.forEach((plan, i) => {

            const total = totalVolumes[i] || 1;
            const done = completedVolumes[i] || 0;
            const pct = Math.round((done / total) * 100);

            if (pct === 100 && !plan.completed && !modalShown) {

                modalShown = true;
                completedGoalIndex = i;

                document.getElementById('successMessage').textContent =
                    `${plan.name} 목표를 완료했어요!`;

                document.getElementById('successModal').style.display = 'flex';
            }

            const el = document.querySelector(
                `.subject-group[data-subj-index="${i}"] .subj-score`
            );

            if (el) el.textContent = `목표 + ${pct}%`;

            totalPct += pct;
        });
    }

    // =============================
    // 체크 이벤트
    // =============================
    document.addEventListener('click', (e) => {

        if (e.target.classList.contains('check-box')) {

            const li = e.target.closest('.task-item');
            const subj = e.target.closest('.subject-group');

            const subjIndex = parseInt(subj.dataset.subjIndex);
            const itemIndex = Array.from(li.parentNode.children).indexOf(li);

            li.classList.toggle('checked');

            const isChecked = li.classList.contains('checked');

            completedVolumes[subjIndex] += isChecked ? 1 : -1;

            if (!checkedToday[subjIndex]) checkedToday[subjIndex] = {};
            checkedToday[subjIndex][itemIndex] = isChecked;

            localStorage.setItem(`checkedToday_${userKey}`, JSON.stringify(checkedToday));

            renderAll();
        }
    });

    // =============================
    // 모달 닫기
    // =============================
    document.getElementById('closeModalBtn')?.addEventListener('click', () => {

        document.getElementById('successModal').style.display = 'none';
        modalShown = false;

        if (typeof completedGoalIndex === "number") {

            plans[completedGoalIndex].completed = true;

            if (!hiddenGoals.includes(completedGoalIndex)) {
                hiddenGoals.push(completedGoalIndex);
                localStorage.setItem(`hiddenGoals_${userKey}`, JSON.stringify(hiddenGoals));
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