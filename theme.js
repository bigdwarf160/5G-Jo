document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".theme-card");

    const themeList = [
        "default",
        "dark",
        "spring",
        "focus",
        "summer",
        "autumn"
    ];

    const isLoggedInSession =
        sessionStorage.getItem("isLoggedIn") === "true";

    const userNameSession =
        sessionStorage.getItem("userName");

    const isLoggedInLocal =
        localStorage.getItem("isLoggedIn") === "true";

    const userNameLocal =
        localStorage.getItem("userName");

    let currentUser = null;

    if (isLoggedInSession && userNameSession) {

        currentUser = userNameSession;

    } else if (isLoggedInLocal && userNameLocal) {

        currentUser = userNameLocal;

        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userName", currentUser);
    }

    if (!currentUser) {

        window.location.href = "login.html";
        return;
    }

    const userKey = currentUser.trim();

    const themeKey = `theme_${userKey}`;

    // 구매한 테마 저장 key
    const purchasedKey = `purchasedThemes_${userKey}`;

    const themePrices = {
        default: 0,
        dark: 100,
        spring: 180,
        focus: 200,
        summer: 300,
        autumn: 150
    };

    function getPurchasedThemes() {

        return JSON.parse(
            localStorage.getItem(purchasedKey)
        ) || [];
    }

    function savePurchasedThemes(themes) {

        localStorage.setItem(
            purchasedKey,
            JSON.stringify(themes)
        );
    }

    function applyTheme(theme) {

        document.body.classList.remove(...themeList);
        document.body.classList.add(theme);
    }

    const savedTheme =
        localStorage.getItem(themeKey) || "default";

    let selectedTheme = savedTheme;

    applyTheme(savedTheme);

    const activeCard =
        document.querySelector(
            `.theme-card[data-theme="${savedTheme}"]`
        );

    if (activeCard) {

        activeCard.classList.add("active");
    }

    const backBtn =
        document.getElementById("backBtn");

    backBtn?.addEventListener("click", () => {

        window.location.href = "main.html";
    });

    const buyBtn =
        document.getElementById("buyBtn");

    const modal =
        document.getElementById("buyModal");

    const closeBtn =
        document.getElementById("closeModalBtn");

    const modalTitle =
        modal.querySelector("h2");

    const modalText =
        modal.querySelector("p");

    let canBuyTheme = false;

    cards.forEach(card => {

        card.addEventListener("click", () => {

            const theme = card.dataset.theme;

            if (!theme) return;

            selectedTheme = theme;

            cards.forEach(c =>
                c.classList.remove("active")
            );

            card.classList.add("active");

            applyTheme(theme);

            const purchasedThemes = getPurchasedThemes();

            // 기본 테마 or 이미 구매한 테마는 바로 저장
            if (
                theme === "default" ||
                purchasedThemes.includes(theme)
            ) {

                localStorage.setItem(themeKey, theme);

                return;
            }
        });
    });

    buyBtn?.addEventListener("click", () => {

        if (selectedTheme === "default") {

            localStorage.setItem(themeKey, "default");
            return;
        }

        let purchasedThemes = getPurchasedThemes();

        // 이미 구매한 테마
        if (purchasedThemes.includes(selectedTheme)) {

            localStorage.setItem(themeKey, selectedTheme);

            canBuyTheme = false;

            modalTitle.textContent =
                "이미 구매한 테마입니다!";

            modalText.textContent =
                "구매한 테마가 적용되었습니다.";

            modal.style.display = "flex";

            return;
        }

        const currentPoint =
            Number(
                localStorage.getItem(`points_${userKey}`)
            ) || 0;

        const price =
            themePrices[selectedTheme];

        if (currentPoint < price) {

            canBuyTheme = false;

            modalTitle.textContent =
                "포인트 부족!";

            modalText.textContent =
                "포인트가 부족합니다.";

            modal.style.display = "flex";

            return;
        }

        canBuyTheme = true;

        // 포인트 차감
        localStorage.setItem(
            `points_${userKey}`,
            currentPoint - price
        );

        // 구매한 테마 목록에 추가
        purchasedThemes.push(selectedTheme);

        savePurchasedThemes(purchasedThemes);

        // 테마 저장
        localStorage.setItem(
            themeKey,
            selectedTheme
        );

        modalTitle.textContent =
            "구매 완료!";

        modalText.textContent =
            "테마 구매가 완료되었습니다.";

        modal.style.display = "flex";
    });

    closeBtn?.addEventListener("click", () => {

        if (modal) {

            modal.style.display = "none";
        }

        if (!canBuyTheme) {

            return;
        }

        alert("테마가 적용되었습니다!");
    });

});
