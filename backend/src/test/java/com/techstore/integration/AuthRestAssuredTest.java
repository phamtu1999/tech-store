package com.techstore.integration;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class AuthRestAssuredTest {

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.basePath = "/api/v1";
    }

    @Test
    void registerAndLogin_Flow_ShouldSucceed() {
        String uniqueEmail = "newuser_" + System.currentTimeMillis() + "@test.com";
        
        // 1. Register
        Map<String, String> registerReq = new HashMap<>();
        registerReq.put("fullName", "New User");
        registerReq.put("email", uniqueEmail);
        registerReq.put("password", "Password123!");
        registerReq.put("phone", "0987654321");

        given()
            .contentType(ContentType.JSON)
            .body(registerReq)
        .when()
            .post("/auth/register")
        .then()
            .statusCode(200)
            .body("result.email", equalTo(uniqueEmail))
            .body("result.token", notNullValue());

        // 2. Login with the new account
        Map<String, String> loginReq = new HashMap<>();
        loginReq.put("email", uniqueEmail);
        loginReq.put("password", "Password123!");

        given()
            .contentType(ContentType.JSON)
            .body(loginReq)
        .when()
            .post("/auth/authenticate")
        .then()
            .statusCode(200)
            .body("result.token", notNullValue())
            .body("result.role", equalTo("ROLE_USER"));
    }

    @Test
    void register_WithDuplicateEmail_ShouldReturnError() {
        // First registration
        String email = "duplicate@test.com";
        Map<String, String> req = new HashMap<>();
        req.put("fullName", "First User");
        req.put("email", email);
        req.put("password", "Password123!");

        given()
            .contentType(ContentType.JSON)
            .body(req)
        .post("/auth/register");

        // Second registration with same email
        given()
            .contentType(ContentType.JSON)
            .body(req)
        .when()
            .post("/auth/register")
        .then()
            .statusCode(not(200)); // Should be 400 or 500 depending on exception mapping
    }

    @Test
    void forgotPassword_ShouldReturn200() {
        Map<String, String> req = new HashMap<>();
        req.put("email", "anyone@test.com");

        given()
            .contentType(ContentType.JSON)
            .body(req)
        .when()
            .post("/auth/password/forgot")
        .then()
            .statusCode(200);
    }

    @Test
    void refreshToken_WithInvalidToken_ShouldReturnError() {
        Map<String, String> req = new HashMap<>();
        req.put("refreshToken", "invalid-token");

        given()
            .contentType(ContentType.JSON)
            .body(req)
        .when()
            .post("/auth/refresh")
        .then()
            .statusCode(not(200));
    }
}
