const pw = document.getElementById("password");
const pwConfirm = document.getElementById("passwordConfirm");
const pwFeedback = document.getElementById("passwordFeedback"); // 조건 메시지
const checkMsg = document.getElementById("checkMsg"); // 일치 메시지

function checkPassword() {
    const rule = /^(?=.*[a-z])(?=.*[0-9]).{10,}$/; // 소문자+숫자 포함, 10자 이상 - 임시

    // 조건 체크 
    if (pw.value === "") {
        pwFeedback.textContent = ""; 
    } else if (!rule.test(pw.value)) {
        pwFeedback.textContent = "✗ 조건을 만족하지 않습니다"; // 바로 아래 줄 표시
        pwFeedback.style.color = "red";
    } else {
        pwFeedback.textContent = "조건을 만족합니다";
        pwFeedback.style.color = "green";
    }

    // 비밀번호 일치 체크
    if (pwConfirm.value === "") {
        checkMsg.textContent = "";
    } else if (pw.value === pwConfirm.value) {
        checkMsg.textContent = "✓ 비밀번호가 일치합니다";
        checkMsg.style.color = "green";
    } else {
        checkMsg.textContent = "✗ 비밀번호가 일치하지 않습니다";
        checkMsg.style.color = "red";
    }
}

pw.addEventListener("input", checkPassword);
pwConfirm.addEventListener("input", checkPassword);