document.addEventListener('DOMContentLoaded', () => {
    // =============================
    // 로그인 
    // =============================
    const loginForm = document.getElementById('loginForm');
    const keepLogin = document.getElementById('keepLogin'); // 체크박스

    loginForm.addEventListener('submit', function(event){
        event.preventDefault(); 

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            alert('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        console.log('로그인 시도:', username, password);

        if (keepLogin.checked) {
    // 로그인 유지 (localStorage)
    localStorage.setItem('loginKeep', 'true');
    localStorage.setItem('userName', username);

    // 세션 제거
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userName');

    } else {
    // 일반 로그인 (sessionStorage)
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userName', username);

    // 로컬 제거
    localStorage.removeItem('loginKeep');
    localStorage.removeItem('userName');
    }

        // =============================
        // 메인 페이지 이동
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

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });

    // 자동 슬라이드
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);

    // 초기 표시
    showSlide(currentSlide);
});
