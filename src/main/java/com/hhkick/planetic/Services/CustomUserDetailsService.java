package com.hhkick.planetic.Services;

import com.hhkick.planetic.entity.User;
import com.hhkick.planetic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import org.springframework.security.core.userdetails.User.UserBuilder; // 중요

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {

        User userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("USER NOT FOUND"));

        UserBuilder builder = org.springframework.security.core.userdetails.User
                .withUsername(userEntity.getUserId());

        builder.password(userEntity.getPassword());
        builder.roles("USER");

        return builder.build();
    }
}