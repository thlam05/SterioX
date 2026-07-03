package com.thlam05.steriox.common.service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisService {
    private final RedisTemplate<String, Object> redisTemplate;

    public boolean existsKey(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public void setValue(String key, Object value) {
        valueOps().set(key, value);
    }

    public void setValueWithTTL(String key, Object value, long ttlSeconds) {
        valueOps().set(key, value, ttlSeconds, TimeUnit.SECONDS);
    }

    public Object getValue(String key) {
        return valueOps().get(key);
    }

    public void deleteKey(String key) {
        redisTemplate.delete(key);
    }

    public void setHash(String key, String field, Object value) {
        hashOps().put(key, field, value);
    }

    public Object getHash(String key, String field) {
        return hashOps().get(key, field);
    }

    public void listRightPush(String key, Object value) {
        listOps().rightPush(key, value);
    }

    public Object listLeftPop(String key) {
        return listOps().leftPop(key);
    }

    public void setAdd(String key, Object... values) {
        setOps().add(key, values);
    }

    public void setRemove(String key, Object... values) {
        setOps().remove(key, values);
    }

    public boolean setIsMember(String key, Object value) {
        return Boolean.TRUE.equals(setOps().isMember(key, value));
    }

    public Set<Object> setMembers(String key) {
        Set<Object> members = setOps().members(key);
        return members != null ? members : Set.of();
    }

    public long setSize(String key) {
        Long size = setOps().size(key);
        return size != null ? size : 0L;
    }

    public boolean zSetAdd(String key, Object value, double score) {
        return Boolean.TRUE.equals(zSetOps().add(key, value, score));
    }

    public long zSetRemove(String key, Object... values) {
        Long removed = zSetOps().remove(key, values);
        return removed != null ? removed : 0L;
    }

    public long zSetRemoveRangeByScore(String key, double minScore, double maxScore) {
        Long removed = zSetOps().removeRangeByScore(key, minScore, maxScore);
        return removed != null ? removed : 0L;
    }

    public Set<Object> zSetMembers(String key) {
        Set<Object> members = zSetOps().range(key, 0, -1);
        return members != null ? members : Set.of();
    }

    public long zSetSize(String key) {
        Long size = zSetOps().size(key);
        return size != null ? size : 0L;
    }

    public void deleteKeysByPattern(String pattern) {
        Set<String> keys = redisTemplate.keys(pattern);
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }

    private ValueOperations<String, Object> valueOps() {
        return redisTemplate.opsForValue();
    }

    private HashOperations<String, Object, Object> hashOps() {
        return redisTemplate.opsForHash();
    }

    private ListOperations<String, Object> listOps() {
        return redisTemplate.opsForList();
    }

    private SetOperations<String, Object> setOps() {
        return redisTemplate.opsForSet();
    }

    private ZSetOperations<String, Object> zSetOps() {
        return redisTemplate.opsForZSet();
    }
}
