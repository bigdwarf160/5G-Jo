const usedIds = ["user1","admin","test"];

let emailCode = "";

function isValidId(id){
    const trimmed = id.trim();
    const regex = /^[a-zA-Z0-9]{4,12}$/;
    return regex.test(trimmed);
}

// 아이디 중복확인 
function checkId(){

const id = document.getElementById("idInput").value;
const msg = document.getElementById("idMessage");

 if(!isValidId(id)){
        msg.textContent="✗ 아이디는 4~12자 영문/숫자만 가능합니다";
        msg.className="error";
        return;
    }

// localStorage로 (임시 DB) 
if(usedIds.includes(id) || localStorage.getItem(id)){
msg.textContent="✗ 이미 사용중인 아이디입니다";
msg.className="error";
}else{
msg.textContent="✓ 사용 가능한 아이디입니다";
msg.className="success";
}

}

// 인증: 임의로 인증번호 생성해서 넘어감//
// 추후 백엔드 - 인증 

/* 인증번호 보내기 */
function sendCode(){

const email = document.getElementById("emailInput").value;
const msg = document.getElementById("emailMessage");

if(email===""){
msg.textContent="✗ 이메일을 입력해주세요";
msg.className="error";
return;
}

/* 6자리 인증번호 생성 */
emailCode = Math.floor(100000 + Math.random()*900000);

msg.textContent="✓ 인증번호가 전송되었습니다 (테스트:"+emailCode+")";
msg.className="success";

}

/* 인증번호 확인 */
function checkCode(){

const codeInput = document.getElementById("codeInput").value;
const codeMessage = document.getElementById("codeMessage");

// 자리수 검사
if(codeInput.length !== 6){
codeMessage.textContent="✗ 인증번호는 6자리입니다";
codeMessage.className="error";
return;
}

// 인증번호 일치 여부
if(codeInput == emailCode){
codeMessage.textContent="✓ 인증이 완료되었습니다";
codeMessage.className="success";
}else{
codeMessage.textContent="✗ 인증번호가 올바르지 않습니다";
codeMessage.className="error";
}

}

// 비밀번호 검사 
const passwordInput = document.getElementById("passwordInput");
const passwordMessage = document.getElementById("passwordMessage");

// 입력 시 실시간 검증
passwordInput.addEventListener("input",function(){

const pw = passwordInput.value;
const regex = /^(?=.*[a-z])(?=.*\d).{10,}$/; // 소문자 + 숫자 포함, 10자 이상

if(regex.test(pw)){
passwordMessage.textContent="✓ 사용 가능한 비밀번호입니다";
passwordMessage.className="success";
}else{
passwordMessage.textContent="✗ 조건을 만족하지 않습니다";
passwordMessage.className="error";
}

});

// 비밀번호 확인
const passwordCheck = document.getElementById("passwordCheck");
const passwordCheckMessage = document.getElementById("passwordCheckMessage");

passwordCheck.addEventListener("input",function(){

if(passwordInput.value===passwordCheck.value){
passwordCheckMessage.textContent="✓ 비밀번호가 일치합니다";
passwordCheckMessage.className="success";
}else{
passwordCheckMessage.textContent="✗ 비밀번호가 일치하지 않습니다";
passwordCheckMessage.className="error";
}

});

// 회원가입
document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();

    const id = document.getElementById("idInput").value.trim();
    const pw = document.getElementById("passwordInput").value;
    const pwCheck = document.getElementById("passwordCheck").value;
    const codeMsg = document.getElementById("codeMessage").textContent;

    // 아이디 형식 검사
    if(!isValidId(id)) {
    alert("아이디는 4~12자 영문/숫자만 가능합니다.");
    return;

    }

    // 기존 + localStorage 체크 : 아이디 중복 검사
    if(usedIds.includes(id) || localStorage.getItem(id)){
        alert("이미 존재하는 아이디입니다.");
        return;
    }

    // 이메일 인증 여부 확인
    if(!codeMsg.includes("완료")){
        alert("이메일 인증을 완료해주세요.");
        return;
    }

    // 비밀번호 일치 확인
    if(pw !== pwCheck){
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    const user = {
        id: id,
        password: pw
    };

    localStorage.setItem(id, JSON.stringify(user));

    localStorage.setItem("loginUser", id);
    
    alert("회원가입 완료!");
    location.href = "makeplan.html";
});