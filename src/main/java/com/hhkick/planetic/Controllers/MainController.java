package com.hhkick.planetic.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
    @GetMapping("/main")
    public String mainPage() {
        return "html/main";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "html/login";
    }

    @GetMapping("makeplan")
    public String makePlan() {
        return "html/makeplan";
    }

    @GetMapping("password")
    public String password() {
        return "html/password";
    }

    @GetMapping("signup")
    public String signupPage() {
        return "html/signup";
    }

    @GetMapping("/myPage")
    public String myPage() {
        return "html/myPage";
    }
}
