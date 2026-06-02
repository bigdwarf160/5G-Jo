package com.hhkick.planetic.Controllers;

import com.hhkick.planetic.Services.EmailAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class EmailAuthController {

    private final EmailAuthService authService;

    // 인증코드 발송
    @PostMapping("/send")
    public String send(@RequestParam String email) {
        authService.sendCode(email);
        return "인증코드 발송 완료";
    }

    // 인증코드 확인
    @PostMapping("/verify")
    public String verify(@RequestParam String email,
                         @RequestParam String code) {

        if (authService.verifyCode(email, code)) {
            return "인증 성공";
        }
        return "인증 실패";
    }
}