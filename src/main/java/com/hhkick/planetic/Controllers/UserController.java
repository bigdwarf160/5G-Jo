package com.hhkick.planetic.Controllers;

import com.hhkick.planetic.entity.User;
import com.hhkick.planetic.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.hhkick.planetic.GoalDTO.UserCreateRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    // =============================
    // 아이디 중복 확인
    // =============================
    @GetMapping("/check-id")
    public boolean checkId(@RequestParam String userId) {
        return userService.isDuplicate(userId);
    }

    // =============================
    // 회원가입
    // =============================
    @PostMapping
    public String createUser(@RequestBody UserCreateRequest req) {
        userService.signup(req);
        return "회원가입 완료";
    }

    // =============================
    // 🔥 유저 조회 (main에서 필요)
    // =============================
    @GetMapping("/{userId}")
    public User getUser(@PathVariable String userId) {
        return userService.findByUserId(userId);
    }
}