document.addEventListener('DOMContentLoaded', () => {
    // =============================
    // 로그인 기능
    // =============================
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event){
        event.preventDefault(); // 실제 서버 호출 전까지 막기

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('로그인 시도:', username, password);

        // 테스트용: 로그인 성공 시 메인 페이지 이동 (임시)
        window.location.href = 'main.html';
    });

    // 홍보 이미지 슬라이더
    const slides = document.querySelectorAll('.promo-slider .slide');
    const prevBtn = document.querySelector('.promo-slider .prev');
    const nextBtn = document.querySelector('.promo-slider .next');
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
    }, 5000); // 5초마다 자동 전환되도록!

    // 초기 표시
    showSlide(currentSlide);
});