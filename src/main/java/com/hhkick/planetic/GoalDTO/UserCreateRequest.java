package com.hhkick.planetic.GoalDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserCreateRequest {
    private String userId;
    private String password;
    private String name;
    private String email;
}