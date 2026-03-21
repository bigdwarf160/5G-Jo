document.addEventListener('DOMContentLoaded', () => {
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

    // 기본 시작일 설정
    startDateInput.value = new Date().toISOString().split('T')[0];

    // 실시간 계산 및 미리보기 업데이트 
    function updatePlan() {
        const start = new Date(startDateInput.value);
        const end = new Date(endDateInput.value);
        const total = parseInt(totalAmountInput.value) || 0;
        const unit = unitSelect.value;
        const time = studyTimeSelect.value;
        
        document.querySelectorAll('.resUnitText').forEach(el => el.textContent = unit);
        resTotal.textContent = total;
        resTime.textContent = (time % 1 === 0.5) ? time : Math.floor(time);

        if (start && end && end >= start && total > 0) {
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            const dailyAmount = Math.ceil(total / days);
            
            resPeriod.textContent = days;
            resDaily.textContent = dailyAmount;
            
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

    // 생성하기 버튼 클릭 시 데이터 저장 및 이동
    planForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const goalData = {
            name: document.getElementById('goalName').value,
            type: document.getElementById('goalType').value,
            total: totalAmountInput.value,
            unit: unitSelect.value,
            start: startDateInput.value,
            end: endDateInput.value,
            dailyTime: studyTimeSelect.value,
            dailyAmount: resDaily.textContent
        };

        // 데이터가 비어있는지 체크
        if (!goalData.name || !goalData.total || goalData.total <= 0) {
            alert("목표 이름과 총 분량을 정확히 입력해 주세요!");
            return;
        }

        // 로컬 스토리지에 'currentPlan'이라는 이름으로 저장
        localStorage.setItem('currentPlan', JSON.stringify(goalData));

        // main.html로 이동
        window.location.href = 'main.html';
    });

    // 입력값 변경 시 실시간 반영
    [startDateInput, endDateInput, totalAmountInput, unitSelect, studyTimeSelect].forEach(el => {
        el.addEventListener('input', updatePlan);
    });

    updatePlan();
});