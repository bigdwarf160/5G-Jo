package com.hhkick.planetic.GoalDTO;
import com.fasterxml.jackson.annotation.JsonProperty;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @JsonProperty("userId")
    private String userId;

    @JsonProperty("password")
    private String password;
}