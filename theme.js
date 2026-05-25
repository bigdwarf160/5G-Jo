document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".theme-card");

    // default = 기본, dark = 다크 테마,  spring = 봄 테마, focus = 그린 테마
    const themeList = ["default", "dark", "spring", "focus"];

    // ===================================
    // main.js랑 동일한 방식으로 로그인/유저 처리
    // ===================================
    const isLoggedInSession =
        sessionStorage.getItem('isLoggedIn') === 'true';

    const userNameSession =
        sessionStorage.getItem('userName');

    const isLoggedInLocal =
        localStorage.getItem('isLoggedIn') === 'true';

    const userNameLocal =
        localStorage.getItem('userName');

    let currentUser = null;

    if (isLoggedInSession && userNameSession) {

        currentUser = userNameSession;

    } else if (isLoggedInLocal && userNameLocal) {

        currentUser = userNameLocal;

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userName', currentUser);
    }

    if (!currentUser) {

        window.location.href = "login.html";
        return;
    }

    // =========================
    // 유저별 테마 키
    // =========================
    const userKey = currentUser.trim();

    const themeKey =
        `theme_${userKey}`;

    // =========================
    // 테마 적용 함수
    // 기본 테마도 body에 default 클래스 추가
    // default가 기본 원래 테마로 저장됨 
    // =========================
    function applyTheme(theme) {

        document.body.classList.remove(...themeList);

        document.body.classList.add(theme);
    }

    // =========================
    // 저장된 테마 불러오기
    // =========================
    const savedTheme =
        localStorage.getItem(themeKey) || "default";

    let selectedTheme = savedTheme;

    applyTheme(savedTheme);

    const activeCard = document.querySelector(
        `.theme-card[data-theme="${savedTheme}"]`
    );

    if (activeCard) {

        activeCard.classList.add("active");
    }

    // =========================
    // 카드 클릭 = 테마 미리보여줌
    // =========================
    cards.forEach(card => {

        card.addEventListener("click", () => {

            const theme =
                card.dataset.theme;

            if (!theme) return;

            selectedTheme = theme;

            cards.forEach(c =>
                c.classList.remove("active")
            );

            card.classList.add("active");

            applyTheme(theme);
        });
    });

    // =========================
    // 메인으로 돌아가기 버튼
    // =========================
    const backBtn =
        document.getElementById("backBtn");

    backBtn?.addEventListener("click", () => {

        window.location.href = "main.html";
    });

    // =========================
    // 구매 모달
    // =========================
    const buyBtn =
        document.getElementById("buyBtn");

    const modal =
        document.getElementById("buyModal");

    const closeBtn =
        document.getElementById("closeModalBtn");

    buyBtn?.addEventListener("click", () => {

        if (modal) {

            modal.style.display = "flex";
        }
    });

    closeBtn?.addEventListener("click", () => {

        if (selectedTheme === "default") {

            localStorage.removeItem(themeKey);

        } else {

            localStorage.setItem(
                themeKey,
                selectedTheme
            );
        }

        if (modal) {

            modal.style.display = "none";
        }

        alert("테마가 적용되었습니다!");
    });

});