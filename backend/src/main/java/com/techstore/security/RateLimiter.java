package com.techstore.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimiter {
    String name() default "default";
    int capacity() default 10;
    int tokens() default 1;
    int period() default 1; // in minutes
}
