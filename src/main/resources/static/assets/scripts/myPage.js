let currentEditIndex = null

// 공부 데이터
const studyData = {
    "2026-3-7": { math: 2 },
    "2026-3-8": { math: 4 },
    "2026-3-9": { math: 1 }
}

// 목표 데이터
const goal = {
    startDate: "2026-04-07",
    period: 3,
    targetHours: 3
}

let goals = [
    {
        name: "과목1",
        targetHours: 2,   // 하루 목표 공부량
        period: 7,        // 기간 (일)
        startDate: "2026-03-01"
    }
]

/* =======================
   analyzeGoal 함수 (최상위)
   ======================= */
function analyzeGoal(goal) {
    let failDays = []

    let start = new Date(goal.startDate)

    for (let i = 0; i < goal.period; i++) {
        let d = new Date(start)
        d.setDate(start.getDate() + i)

        let key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        let data = studyData[key] || {}

        let total = 0
        for (let sub in data) total += data[sub]

        if (total < goal.targetHours) failDays.push({ date: key, total })
    }

    return failDays
}

/* =======================
   목표 렌더링
   ======================= */
function renderGoals() {
    const box = document.getElementById("goals")
    box.innerHTML = ""

    goals.forEach((g, i) => {
        box.innerHTML += `
<div class="goal">
  <div class="goal-top">
    <span>${g.name}</span>
    <div>
      <button onclick="editGoal(${i})">✏</button>
      <button onclick="deleteGoal(${i})">🗑</button>
    </div>
  </div>
  <div class="progress">
    <div class="progress-bar" style="width:${g.progress || 0}%"></div>
  </div>
  <div>진행률 : ${g.progress || 0}%</div>
</div>
`
    })
}

/* =======================
   캘린더 렌더링
   ======================= */
let date = new Date()

function renderCalendar() {
    const year = date.getFullYear()
    const month = date.getMonth()

    document.getElementById("month").innerText = `${year}년 ${month + 1}월`

    const first = new Date(year, month, 1).getDay()
    const last = new Date(year, month + 1, 0).getDate()

    const cal = document.getElementById("calendar")
    cal.innerHTML = ""

    const days = ["월", "화", "수", "목", "금", "토", "일"]
    days.forEach(d => cal.innerHTML += `<div class="day-name">${d}</div>`)

    let start = (first + 6) % 7
    for (let i = 0; i < start; i++) cal.innerHTML += `<div></div>`

    for (let d = 1; d <= last; d++) {
        const key = `${year}-${month}-${d}`
        const data = studyData[key] || {}

        let total = 0
        for (let sub in data) total += data[sub]

        // 실패한 목표 계산
        let failDays = analyzeGoal(goal)
        let isFail = failDays.some(f => f.date === key)

        cal.innerHTML += `
        <div class="day ${isFail ? 'fail' : ''}" onclick="addStudy('${key}')">
            <div class="day-number">${d}</div>
            <div>${total}h ${isFail ? '❌' : ''}</div>
        </div>
        `
    }

    updateChart()
}

/* =======================
   공부시간 입력
   ======================= */
function addStudy(key) {
    let time = prompt("공부시간 (시간)")
    if (!time) return

    const subject = goals[0].name
    if (!studyData[key]) studyData[key] = {}

    studyData[key][subject] = (studyData[key][subject] || 0) + Number(time)
    localStorage.setItem("studyData", JSON.stringify(studyData))

    renderCalendar()
}

/* =======================
   달 이동
   ======================= */
function changeMonth(n) {
    date.setMonth(date.getMonth() + n)
    renderCalendar()
}

/* =======================
   차트 업데이트
   ======================= */
let chart
function updateChart() {
    let days = []
    let hours = []

    const year = date.getFullYear()
    const month = date.getMonth()
    const last = new Date(year, month + 1, 0).getDate()

    for (let d = 1; d <= last; d++) {
        let key = `${year}-${month}-${d}`
        days.push(d)

        let dayTotal = 0
        if (studyData[key]) {
            for (let sub in studyData[key]) dayTotal += studyData[key][sub]
        }
        hours.push(dayTotal)
    }

    if (chart) chart.destroy()

    chart = new Chart(document.getElementById("chart"), {
        type: "bar",
        data: {
            labels: days,
            datasets: [{
                label: "공부시간",
                data: hours,
                backgroundColor: "#C5D1C3"
            }]
        }
    })
}

/* =======================
   초기 실행
   ======================= */
renderGoals()
renderCalendar()