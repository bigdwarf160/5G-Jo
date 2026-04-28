document.addEventListener('DOMContentLoaded', () => {

    // =============================
    // 로그인 체크
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

    const welcomeElem = document.querySelector('.user-welcome strong');
    if (welcomeElem) welcomeElem.textContent = currentUser;

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
    document.getElementById('userPoints').textContent = currentPoints + "점";

    // =============================
    // 데이터
    // =============================
    let plans = JSON.parse(localStorage.getItem(`plans_${userKey}`)) || [];

    const todoListArea = document.getElementById('todoListArea');
    const goalList = document.getElementById('goalList');

    todoListArea.innerHTML = "";

    const totalVolumes = [];
    const completedVolumes = [];

    const todayStr = new Date().toISOString().slice(0, 10);

    let checkedToday = JSON.parse(localStorage.getItem(`checkedToday_${userKey}`)) || {};
    const lastDate = localStorage.getItem(`lastDate_${userKey}`);

    if (lastDate !== todayStr) {
        checkedToday = {};
        localStorage.setItem(`lastDate_${userKey}`, todayStr);
        localStorage.setItem(`checkedToday_${userKey}`, JSON.stringify(checkedToday));
    }

    if (plans.length === 0) {
        todoListArea.innerHTML = `<p style="padding:20px;">목표가 없습니다 😢<br>목표를 먼저 생성해주세요!</p>`;
    }

    // =============================
    // 렌더링
    // =============================
    function renderTodos() {
        plans.forEach((plan, idx) => {

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

    function renderProgressBars() {
        const container = document.getElementById("progressCard");
        container.innerHTML = "";

        plans.forEach((plan, i) => {

            const done = completedVolumes[i] || 0;
            const total = totalVolumes[i] || 1;
            const pct = Math.round((done / total) * 100);

            const div = document.createElement("div");
            div.className = "prog-item";

            div.innerHTML = `
                <span class="prog-name">${plan.name}</span>
                <div class="bar-container">
                    <div class="bar-fill" id="fill-${i}"></div>
                </div>
                <span class="prog-num">${pct}%</span>
            `;

            container.appendChild(div);
            div.querySelector(`#fill-${i}`).style.width = pct + "%";
        });
    }

    let modalShown = false;

    function updateUI() {

        let dangerList = [];
        let totalPct = 0;

        plans.forEach((plan, i) => {

            const total = totalVolumes[i] || 1;
            const done = completedVolumes[i] || 0;
            const pct = Math.round((done / total) * 100);

            if (pct === 100 && !plan.completed && !modalShown) {
                
                modalShown = true; 

                plan.completed = true;

                document.getElementById('successMessage').textContent =
                    `${plan.name} 목표를 완료했어요!`;
                document.getElementById('successModal').style.display = 'flex'; 
            }    

            const el = document.querySelector(
                `.subject-group[data-subj-index="${i}"] .subj-score`
            );

            if (el) el.textContent = `목표 + ${pct}%`;

            if (pct < 40) dangerList.push(plan.name);

            totalPct += pct;
        });

        const avg = totalPct / plans.length || 0;

        const status = document.getElementById('riskStatus');
        const alertBtn = document.getElementById('riskAlert');
        const tooltip = document.getElementById('riskTooltip');

        if (avg >= 75) {
            status.textContent = "안전";
            alertBtn.style.display = "none";
            document.querySelector('.risk-circle').style.borderColor = "#6F9B73";
            tooltip.innerHTML = "";

        } else if (avg >= 40) {
            status.textContent = "주의";
            alertBtn.style.display = "flex";
            document.querySelector('.risk-circle').style.borderColor = "#FFA94D";
            tooltip.innerHTML = `현재 <strong>${dangerList.join(", ")}</strong> 과목이 주의 단계입니다.`;

        } else {
            status.textContent = "위험";
            alertBtn.style.display = "flex";
            document.querySelector('.risk-circle').style.borderColor = "#FF5A5A";
            tooltip.innerHTML = `현재 <strong>${dangerList.join(", ")}</strong> 과목이 위험 단계입니다.`;
        }
    }

    function renderGoals() {
        goalList.innerHTML = "";

        plans.forEach(plan => {

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

            updateUI();
            renderProgressBars();
        }
    });

    // =============================
    // 오늘의 나
    // =============================
    let selectedScore = 0;

    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedScore = parseInt(btn.dataset.val);
            document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('saveEvalBtn').addEventListener('click', () => {

        if (selectedScore === 0) {
            alert("점수를 선택하세요!");
            return;
        }

        let evalData = JSON.parse(localStorage.getItem(`dailyEvaluation_${userKey}`)) || {};
        evalData[todayStr] = selectedScore;

        localStorage.setItem(`dailyEvaluation_${userKey}`, JSON.stringify(evalData));

        renderEvaluation();
        alert("평가 저장 완료!");
    });

    function renderEvaluation() {

        const evalData = JSON.parse(localStorage.getItem(`dailyEvaluation_${userKey}`)) || {};
        const values = Object.values(evalData);

        let avg = 0;

        if (values.length > 0) {
            avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
        }

        document.getElementById('avgScore').textContent = avg;
    }

    // =============================
    // 툴팁 클릭 기능
    // =============================
    const alertBtn2 = document.getElementById('riskAlert');
    const tooltip2 = document.getElementById('riskTooltip');

    if (alertBtn2 && tooltip2) {
        alertBtn2.addEventListener('click', (e) => {
            e.stopPropagation();
            tooltip2.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!alertBtn2.contains(e.target)) {
                tooltip2.classList.remove('show');
            }
        });
    }

    // =============================
    // 초기 실행
    // =============================
    renderTodos();
    renderGoals();
    updateUI();
    renderProgressBars();
    renderEvaluation();

    const closeBtn = document.getElementById('closeModalBtn');

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        document.getElementById('successModal').style.display = 'none';
        modalShown = false;
    });
}

});