package com.dat.todo.config;

import io.github.bucket4j.*;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimiterConfig {

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String key) {
        return buckets.computeIfAbsent(key, k -> createNewBucket());
    }

    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}