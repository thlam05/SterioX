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

    public void set(String key, Object value) {
        valueOps().set(key, value);
    }

    public void setWithTTL(String key, Object value, long timeoutInSeconds) {
        valueOps().set(key, value, timeoutInSeconds, TimeUnit.SECONDS);
    }

    public Object get(String key) {
        return valueOps().get(key);
    }

    public void delete(String key) {
        redisTemplate.delete(key);
    }

    public boolean hasKey(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public void putHash(String key, String hashKey, Object value) {
        hashOps().put(key, hashKey, value);
    }

    public Object getHash(String key, String hashKey) {
        return hashOps().get(key, hashKey);
    }

    public void pushToList(String key, Object value) {
        listOps().rightPush(key, value);
    }

    public Object popFromList(String key) {
        return listOps().leftPop(key);
    }

    public void addToSet(String key, Object... values) {
        setOps().add(key, values);
    }

    public void removeFromSet(String key, Object... values) {
        setOps().remove(key, values);
    }

    public boolean isMemberOfSet(String key, Object value) {
        return Boolean.TRUE.equals(setOps().isMember(key, value));
    }

    public Set<Object> getSetMembers(String key) {
        Set<Object> members = setOps().members(key);
        return members != null ? members : Set.of();
    }

    public Long countMember(String key) {
        Long size = setOps().size(key);
        return size != null ? size : 0L;
    }

    public boolean addToZSet(String key, Object value, double score) {
        return Boolean.TRUE.equals(zSetOps().add(key, value, score));
    }

    public Long removeFromZSet(String key, Object... values) {
        return zSetOps().remove(key, values);
    }

    public Long removeRangeByScore(String key, double minScore, double maxScore) {
        return zSetOps().removeRangeByScore(key, minScore, maxScore);
    }

    public Set<Object> getZSetMembers(String key) {
        Set<Object> members = zSetOps().range(key, 0, -1);
        return members != null ? members : Set.of();
    }

    public Long countZSetSize(String key) {
        Long size = zSetOps().size(key);
        return size != null ? size : 0L;
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
