document.addEventListener('DOMContentLoaded', () => {

    // 초기 데이터 (임시)
    const totalVolumes = [100, 100, 100]; 
    let completedVolumes = [37, 44, 37]; 
    let currentPoints = 4583;

    const pointDisplay = document.getElementById('userPoints');

    // 목표 생성 페이지 이동 (항상 보이게)
    window.goToGoalPage = function(){
        location.href = "makeplan.html";
    }

    // 목표 D-Day 데이터 & 렌더링
    const goals = [
        { name: "과목 1", due: "2026-03-31" },
        { name: "과목 2", due: "2026-05-17" },
        { name: "과목 3", due: "2026-04-28" }
    ];

    function getDDay(dueDateStr) {
        const today = new Date();
        const dueDate = new Date(dueDateStr);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) return `D-${diffDays}`;
        else if (diffDays === 0) return "D-Day";
        else return `D+${Math.abs(diffDays)}`;
    }

    function renderGoals() {
        const goalList = document.getElementById('goalList');
        goalList.innerHTML = "";

        goals.forEach(goal => {
            const li = document.createElement('li');
            li.className = "goal-item";
            li.innerHTML = `<span class="goal-name">${goal.name}</span>
                            <span class="goal-dday">${getDDay(goal.due)}</span>`;
            goalList.appendChild(li);
        });
    }

    // 투두 체크 이벤트
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach((item) => {
        item.addEventListener('click', () => {

            const isChecked = item.classList.toggle('checked');
            
            // 포인트 (+10 / -10)
            currentPoints += isChecked ? 10 : -10;
            pointDisplay.textContent = currentPoints;

            // 진행률 (+5 / -5)
            const subjIdx = item.closest('.subject-group').dataset.subjIndex;
            completedVolumes[subjIdx] += isChecked ? 5 : -5;
            
            updateUI();
        });
    });

    // UI 업데이트
    function updateUI() {
        let dangerList = [];
        let totalPct = 0;

        totalVolumes.forEach((total, i) => {
            const pct = Math.min(100, Math.max(0,
                Math.round((completedVolumes[i] / total) * 100)
            ));

            document.getElementById(`bar${i+1}`).style.width = pct + '%';
            document.getElementById(`pct${i+1}`).textContent = pct + '%';

            if (pct < 40) dangerList.push(`과목 ${i+1}`);
            totalPct += pct;
        });

        const avg = totalPct / 3;
        const status = document.getElementById('riskStatus');
        const alertBtn = document.getElementById('riskAlert');
        const tooltip = document.getElementById('riskTooltip');

        // 위험도 표시
        if (avg >= 75) {
            status.textContent = "안전";
            alertBtn.style.display = "none"; 
        } else if (avg >= 40) {
            status.textContent = "주의";
            alertBtn.style.display = "flex"; 
        } else {
            status.textContent = "위험";
            alertBtn.style.display = "flex"; 
        }

        // 위험 과목 표시
        if (dangerList.length > 0) {
            tooltip.innerHTML = `현재 <strong>${dangerList.join(", ")}</strong> 과목이 위험해요!`;
        } else {
            tooltip.innerHTML = `현재 <strong>전체적인 진행</strong>이 더뎌요!`;
        }
    }

    // 오늘의 나 평가
    const numBtns = document.querySelectorAll('.num-btn');
    let selectedRating = 0;

    numBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            numBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedRating = parseInt(btn.dataset.val);
        });
    });

    document.getElementById('saveEvalBtn').addEventListener('click', () => {
        if (!selectedRating) {
            alert("오늘의 노력을 숫자로 선택해주세요!");
            return;
        }

        alert("평가가 저장되었습니다!");
        document.getElementById('avgScore').textContent = selectedRating.toFixed(1);
    });

    // 위험도 툴팁
    document.getElementById('riskAlert').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('riskTooltip').classList.toggle('show');
    });

    document.addEventListener('click', () => {
        document.getElementById('riskTooltip').classList.remove('show');
    });

    // 초기 실행
    updateUI();
    renderGoals(); // 목표 D-Day 렌더링
});