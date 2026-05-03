document.addEventListener('DOMContentLoaded', () => {

    // =============================
    // 사용자 정보 가져오기 
    // =============================
    const currentUser = sessionStorage.getItem('userName') || localStorage.getItem('userName');

    // 로그인 안 되어있으면 로그인 페이지로 이동
    if (!currentUser) {
        alert("로그인이 필요합니다.");
        window.location.href = "login.html";
        return;
    }

    const userKey = currentUser; // 사용자별 데이터 구분 키

    const planForm = document.getElementById('planForm');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const totalAmountInput = document.getElementById('totalAmount');
    const unitSelect = document.getElementById('unit');
    const studyTimeSelect = document.getElementById('studyTime');
    const previewList = document.getElementById('planPreviewList');
    
    const resTotal = document.getElementById('resTotal');
    const resPeriod = document.getElementById('resPeriod');
    const resTime = document.getElementById('resTime');
    const resDaily = document.getElementById('resDaily');

    // 공부 시간 옵션 자동 생성 (30분 단위)
    for (let i = 0.5; i <= 12; i += 0.5) {
        const opt = document.createElement('option');
        opt.value = i;
        const h = Math.floor(i);
        const m = (i % 1 === 0.5) ? '30분' : '';
        opt.textContent = (h > 0 ? h + '시간 ' : '') + m;
        if (i === 2) opt.selected = true;
        studyTimeSelect.appendChild(opt);
    }

    // 기본 시작일 설정 (오늘)
    startDateInput.value = new Date().toISOString().split('T')[0];

    // =============================
    // 계획 자동 계산 + 미리보기 : 추후 AI 교체
    // =============================
    function updatePlan() {
        const start = new Date(startDateInput.value);
        const end = new Date(endDateInput.value);
        const total = parseInt(totalAmountInput.value) || 0;
        const unit = unitSelect.value;
        const time = studyTimeSelect.value;
        
        document.querySelectorAll('.resUnitText').forEach(el => el.textContent = unit);
        resTotal.textContent = total;
        resTime.textContent = (time % 1 === 0.5) ? time : Math.floor(time);

        // 유효한 입력일 떄만 계산
        if (start && end && end >= start && total > 0) {
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // 총 기간(일수)
            const dailyAmount = Math.ceil(total / days);  // 하루 분량
            
            resPeriod.textContent = days;
            resDaily.textContent = dailyAmount;
            
            // 미리보기 리스트 생성
            previewList.innerHTML = '';
            let currentIdx = 1;

            for (let i = 0; i < days; i++) {
                const currentDate = new Date(start);
                currentDate.setDate(start.getDate() + i);
                const dateStr = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
                
                const startRange = currentIdx;
                const endRange = Math.min(currentIdx + dailyAmount - 1, total);
                
                const li = document.createElement('li');
                li.innerHTML = `<strong>${dateStr}</strong> <span>${startRange} ~ ${endRange} ${unit}</span>`;
                previewList.appendChild(li);
                
                currentIdx += dailyAmount;
                if (currentIdx > total) break;
            }
        } else {
            resPeriod.textContent = '0';
            resDaily.textContent = '0';
            previewList.innerHTML = '<li class="empty-msg">기간과 분량을 입력하면 계획이 생성됩니다.</li>';
        }
    }

    // =============================
    // 계획 저장 
    // =============================
    planForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        // 날짜 값 가져오기 
        const start = new Date(startDateInput.value);
        const end = new Date(endDateInput.value);


        if (!startDateInput.value || !endDateInput.value) {
            alert("시작일과 종료일을 입력해주세요.");
            return;
        }

        if (end < start) {
            alert("종료일은 시작일보다 늦어야 합니다.");
            return;
        }
        
        const totalValue = parseInt(totalAmountInput.value);

        if (isNaN(totalValue) || totalValue <= 0) {
            alert("총 분량은 1 이상 입력하세요.");
            return;
        }

        // 목표 데이터 생성
        const goalData = {
            name: document.getElementById('goalName').value,
            type: document.getElementById('goalType').value,
            total: totalValue,
            unit: unitSelect.value,
            start: startDateInput.value,
            end: endDateInput.value,
            dailyTime: studyTimeSelect.value,
            dailyAmount: parseInt(resDaily.textContent) 
        };

        if (!goalData.name || !goalData.total || goalData.total <= 0) {
            alert("목표 이름과 총 분량을 정확히 입력해 주세요!");
            return;
        }
        
        // 사용자별 데이터 불러오기
        let plans = JSON.parse(localStorage.getItem(`plans_${userKey}`)) || [];

        plans.push(goalData);

        // 사용자별 저장
        localStorage.setItem(`plans_${userKey}`, JSON.stringify(plans, null, 2));

        window.location.href = 'main.html';
    });

    // 입력값 변경 시 실시간 업데이트
    [startDateInput, endDateInput, totalAmountInput, unitSelect, studyTimeSelect].forEach(el => {
        el.addEventListener('input', updatePlan);
    });

    updatePlan();
});