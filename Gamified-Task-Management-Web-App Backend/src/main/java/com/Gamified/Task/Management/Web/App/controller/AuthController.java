package com.Gamified.Task.Management.Web.App.controller;

import com.Gamified.Task.Management.Web.App.entity.User;
import com.Gamified.Task.Management.Web.App.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@Component
@RestController
@RequestMapping("/auth")

public class AuthController {
        @Autowired
        private AuthService authService;

        @PostMapping("/register")
        public ResponseEntity<String> register(@RequestBody User user) {
            return ResponseEntity.ok(authService.register(user));
        }

        @PostMapping("/login")
        public ResponseEntity<String> login(@RequestBody Map<String, String> request) {
            return ResponseEntity.ok(authService.login(request.get("username"), request.get("password")));
        }
}
