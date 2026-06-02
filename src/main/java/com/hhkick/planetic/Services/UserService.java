package com.hhkick.planetic.Services;

import com.hhkick.planetic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.hhkick.planetic.GoalDTO.UserCreateRequest;
import com.hhkick.planetic.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor

public class UserService {

    private final EmailAuthService emailAuthService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public User findByUserId(String userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 없음: " + userId));
    }

    public void validateEmail(String email) {
        if (!emailAuthService.isVerified(email)) {
            throw new RuntimeException("이메일 인증 필요");
        }
    }

    public boolean isDuplicate(String userId) {
        return userRepository.existsByUserId(userId);
    }

    public void signup(UserCreateRequest req) {

        //  이메일 인증 체크
        validateEmail(req.getEmail());

        //  비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(req.getPassword());

        User user = new User();
        user.setUserId(req.getUserId());
        user.setPassword(encodedPassword); //  암호화된 값 저장
        user.setName(req.getName());
        user.setEmail(req.getEmail());

        userRepository.save(user);
    }
}