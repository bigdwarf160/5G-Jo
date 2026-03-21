document.addEventListener('DOMContentLoaded', () => {
    // 초기 데이터 및 상태 변수
    const totalVolumes = [100, 100, 100]; 
    let completedVolumes = [37, 44, 37]; 
    let currentPoints = 4583;

    const pointDisplay = document.getElementById('userPoints');

    // 투두 체크 및 포인트/진행률 업데이트
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach((item) => {
        item.addEventListener('click', () => {
            const isChecked = item.classList.toggle('checked');
            
            // 포인트 계산 (+10/-10) - 임시 
            currentPoints += isChecked ? 10 : -10;
            pointDisplay.textContent = currentPoints;

            // 진행률 계산 (+5/-5) - 임시
            const subjIdx = item.closest('.subject-group').dataset.subjIndex;
            completedVolumes[subjIdx] += isChecked ? 5 : -5;
            
            updateUI();
        });
    });

    // UI 업데이트 (진행률 바, 위험도, 툴팁)
    function updateUI() {
        let dangerList = [];
        let totalPct = 0;

        totalVolumes.forEach((total, i) => {
            const pct = Math.min(100, Math.max(0, Math.round((completedVolumes[i] / total) * 100)));
            document.getElementById(`bar${i+1}`).style.width = pct + '%';
            document.getElementById(`pct${i+1}`).textContent = pct + '%';

            if (pct < 40) dangerList.push(`과목 ${i+1}`);
            totalPct += pct;
        });

        const avg = totalPct / 3;
        const status = document.getElementById('riskStatus');
        const alertBtn = document.getElementById('riskAlert');
        const tooltip = document.getElementById('riskTooltip');

        // 위험도 텍스트 
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

        // 위험도 과목 문구 (느낌표 클릭시)
        if (dangerList.length > 0) {
            tooltip.innerHTML = `현재 <strong>${dangerList.join(", ")}</strong> 과목이 위험해요!`;
        } else {
            tooltip.innerHTML = `현재 <strong>전체적인 진행</strong>이 더뎌요!`;
        }
    }

    // 오늘의 나 - 숫자 버튼 평가 로직
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
        if (!selectedRating) return alert("오늘의 노력을 숫자로 선택해주세요!");
        alert("평가가 저장되었습니다!");
        document.getElementById('avgScore').textContent = selectedRating.toFixed(1);
    });

    // 위험도 툴팁
    document.getElementById('riskAlert').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('riskTooltip').classList.toggle('show');
    });
    document.addEventListener('click', () => document.getElementById('riskTooltip').classList.remove('show'));

    // 초기 실행
    updateUI(); 
});