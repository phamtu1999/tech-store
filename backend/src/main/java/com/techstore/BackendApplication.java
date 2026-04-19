package com.techstore;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.boot.CommandLineRunner;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
public class BackendApplication {

	@PostConstruct
	public void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
	}

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner clearCacheOnStartup(RedisTemplate<String, Object> redisTemplate) {
		return args -> {
			try {
				redisTemplate.execute((RedisConnection connection) -> {
					connection.serverCommands().flushDb();
					return "OK";
				});
				System.out.println("✅ DEPLOYMENT: Redis cache flushed successfully.");
			} catch (Exception e) {
				System.err.println("❌ DEPLOYMENT: Failed to flush Redis: " + e.getMessage());
			}
		};
	}
}
