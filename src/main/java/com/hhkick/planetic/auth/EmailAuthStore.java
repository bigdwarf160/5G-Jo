package com.hhkick.planetic.auth;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class EmailAuthStore {

    private final Map<String, String> codeMap = new ConcurrentHashMap<>();
    private final Map<String, Long> timeMap = new ConcurrentHashMap<>();
    private final Set<String> verifiedEmails = ConcurrentHashMap.newKeySet();

    public void save(String email, String code) {
        codeMap.put(email, code);
        timeMap.put(email, System.currentTimeMillis());
    }

    public boolean verify(String email, String code) {
        if (!codeMap.containsKey(email)) return false;

        long savedTime = timeMap.get(email);
        if (System.currentTimeMillis() - savedTime > 1000 * 60 * 5) {
            codeMap.remove(email);
            timeMap.remove(email);
            return false;
        }

        if (codeMap.get(email).equals(code)) {
            verifiedEmails.add(email);
            return true;
        }

        return false;
    }

    public boolean isVerified(String email) {
        return verifiedEmails.contains(email);
    }

    public void remove(String email) {
        codeMap.remove(email);
        timeMap.remove(email);
    }
}