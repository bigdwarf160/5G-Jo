package com.hhkick.planetic.Services;

import com.hhkick.planetic.auth.EmailAuthStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailAuthService {

    private final MailService mailService;
    private final EmailAuthStore store;

    private String createCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000);
    }

    // 인증코드 발송
    public void sendCode(String email) {
        String code = createCode();
        store.save(email, code);
        mailService.sendCode(email, code);
    }

    // 인증코드 검증
    public boolean verifyCode(String email, String code) {
        boolean result = store.verify(email, code);

        if (result) {
            store.remove(email); // 1회용 처리
        }

        return result;
    }

    public boolean isVerified(String email) {
        return store.isVerified(email);
    }
}