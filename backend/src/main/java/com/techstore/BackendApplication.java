package com.techstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.boot.CommandLineRunner;

import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
@EnableAsync
@EnableAspectJAutoProxy
public class BackendApplication {

	@PostConstruct
	public void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
	}

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner clearCacheOnStartup(RedisConnectionFactory connectionFactory) {
		return args -> {
			try (RedisConnection connection = connectionFactory.getConnection()) {
				connection.serverCommands().flushDb();
				System.out.println("✅ DEPLOYMENT: Redis cache flushed successfully via ConnectionFactory.");
			} catch (Exception e) {
				System.err.println("❌ DEPLOYMENT: Failed to flush Redis: " + e.getMessage());
			}
		};
	}
}
