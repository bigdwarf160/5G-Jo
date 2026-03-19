const usedIds = ["user1","admin","test"];

let emailCode = "";

/* 아이디 중복확인 */
function checkId(){

const id = document.getElementById("idInput").value;
const msg = document.getElementById("idMessage");

if(usedIds.includes(id)){
msg.textContent="✗ 이미 사용중인 아이디입니다";
msg.className="error";
}else{
msg.textContent="✓ 사용 가능한 아이디입니다";
msg.className="success";
}

}

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

if(codeInput.length !== 6){
codeMessage.textContent="✗ 인증번호는 6자리입니다";
codeMessage.className="error";
return;
}

if(codeInput == emailCode){
codeMessage.textContent="✓ 인증이 완료되었습니다";
codeMessage.className="success";
}else{
codeMessage.textContent="✗ 인증번호가 올바르지 않습니다";
codeMessage.className="error";
}

}

/* 비밀번호 검사 */
const passwordInput = document.getElementById("passwordInput");
const passwordMessage = document.getElementById("passwordMessage");

passwordInput.addEventListener("input",function(){

const pw = passwordInput.value;
const regex = /^(?=.*[a-z])(?=.*\d).{10,}$/;

if(regex.test(pw)){
passwordMessage.textContent="✓ 사용 가능한 비밀번호입니다";
passwordMessage.className="success";
}else{
passwordMessage.textContent="✗ 조건을 만족하지 않습니다";
passwordMessage.className="error";
}

});

/* 비밀번호 확인 */
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