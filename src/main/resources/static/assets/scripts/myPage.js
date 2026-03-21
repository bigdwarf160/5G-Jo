let goals=[
    {name:"과목1",progress:85},
    {name:"과목2",progress:18},
    {name:"과목3",progress:41}
]

let studyData=JSON.parse(localStorage.getItem("studyData"))||{}

function renderGoals(){

    const box=document.getElementById("goals")
    box.innerHTML=""

    goals.forEach((g,i)=>{

        box.innerHTML+=`
<div class="goal">

<div class="goal-top">
<span>${g.name}</span>

<div>
<button onclick="editGoal(${i})">✏</button>
<button onclick="deleteGoal(${i})">🗑</button>
</div>

</div>

<div class="progress">
<div class="progress-bar" style="width:${g.progress}%"></div>
</div>
<div>진행률 : ${g.progress}%</div>

</div>
`

    })

}

function editGoal(i){

    let name=prompt("목표 수정",goals[i].name)
    if(name) goals[i].name=name

    renderGoals()

}

function deleteGoal(i){

    goals.splice(i,1)
    renderGoals()

}

/* calendar */

let date=new Date()

function renderCalendar(){

    const year=date.getFullYear()
    const month=date.getMonth()

    document.getElementById("month").innerText=
        `${year}년 ${month+1}월`

    const first=new Date(year,month,1).getDay()
    const last=new Date(year,month+1,0).getDate()

    const cal=document.getElementById("calendar")

    cal.innerHTML=""

    const days=["월","화","수","목","금","토","일"]

    days.forEach(d=>{
        cal.innerHTML+=`<div class="day-name">${d}</div>`
    })

    let start=(first+6)%7

    for(let i=0;i<start;i++){
        cal.innerHTML+=`<div></div>`
    }

    for(let d=1;d<=last;d++){

        const key=`${year}-${month}-${d}`
        const hours=studyData[key]||0

        cal.innerHTML+=`
<div class="day" onclick="addStudy('${key}')">
<div class="day-number">${d}</div>
<div>${hours}h</div>
</div>
`

    }

    updateChart()

}

function addStudy(key){

    let time=prompt("공부시간 (시간)")
    if(!time)return

    studyData[key]=(studyData[key]||0)+Number(time)

    localStorage.setItem("studyData",
        JSON.stringify(studyData))

    renderCalendar()

}

function changeMonth(n){

    date.setMonth(date.getMonth()+n)
    renderCalendar()

}

/* chart */

let chart

function updateChart(){

    let days=[]
    let hours=[]

    const year=date.getFullYear()
    const month=date.getMonth()

    const last=new Date(year,month+1,0).getDate()

    for(let d=1;d<=last;d++){

        let key=`${year}-${month}-${d}`
        days.push(d)
        hours.push(studyData[key]||0)

    }

    if(chart) chart.destroy()

    chart=new Chart(document.getElementById("chart"),{

        type:"bar",

        data:{
            labels:days,
            datasets:[{
                label:"공부시간",
                data:hours,
                backgroundColor:"#4CAF50"
            }]
        }

    })

}

renderGoals()
renderCalendar()