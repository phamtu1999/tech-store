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
    void login_WithInvalidCredentials_ShouldReturn401() {
        Map<String, String> loginReq = new HashMap<>();
        loginReq.put("email", "wrong@test.com");
        loginReq.put("password", "badpass");

        given()
            .contentType(ContentType.JSON)
            .body(loginReq)
        .when()
            .post("/auth/authenticate")
        .then()
            .statusCode(401)
            .body("message", notNullValue());
    }

    @Test
    void accessProtectedResource_WithoutToken_ShouldReturn401() {
        given()
        .when()
            .get("/profile")
        .then()
            .statusCode(401);
    }
}
