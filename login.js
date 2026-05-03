document.addEventListener('DOMContentLoaded', () => {
    // =============================
    // 로그인 
    // =============================
    const loginForm = document.getElementById('loginForm'); // 로그인 폼
    const keepLogin = document.getElementById('keepLogin'); // 로그인 유지 체크박스

    loginForm.addEventListener('submit', function(event){
        event.preventDefault();  //폼 제출(페이지 새로고침) 막기

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // 입력값 유효성 검사 
        if (!username || !password) {
            alert('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        console.log('로그인 시도:', username, password);

        if (keepLogin.checked) {

    // 로그인 유지 (localStorage)
    localStorage.setItem('loginKeep', 'true');
    localStorage.setItem('userName', username);

    // 기존 세션 로그인 정보 제거
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userName');

    } else {
    // 일반 로그인 (sessionStorage)
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userName', username);

    // 기존 로컬 로그인 정보 제거
    localStorage.removeItem('loginKeep');
    localStorage.removeItem('userName');
    }

        // =============================
        // 로그인 후 메인 페이지 이동
        // =============================
        window.location.href = 'main.html';
    });

    // =============================
    // 홍보 이미지 슬라이더 - 아직은 자리만
    // =============================
    const slides = document.querySelectorAll('.promo-slider .slide');
    const prevBtn = document.querySelector('.promo-controls .prev');
    const nextBtn = document.querySelector('.promo-controls .next');
    let currentSlide = 0;

    // 슬라이드 표시 함수
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    // 이전 버튼 
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });

    // 다음 버튼
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });

    // 자동 슬라이드 - 5초 마다 
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);

    // 페이지 로드 시 첫 슬라이드 표시
    showSlide(currentSlide);
});
