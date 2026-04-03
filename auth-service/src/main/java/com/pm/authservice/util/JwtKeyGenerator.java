package com.pm.authservice.util;

import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.util.Base64;

public class JwtKeyGenerator {
    public static void main(String[] args) {
        // Generate 256-bit (32-byte) random key for HS256
        byte[] keyBytes = new byte[32];
        new SecureRandom().nextBytes(keyBytes);

        SecretKey key = Keys.hmacShaKeyFor(keyBytes);
        String base64Key = Base64.getEncoder().encodeToString(key.getEncoded());

        System.out.println("Your JWT Secret Key (Base64): " + base64Key);
    }
}

