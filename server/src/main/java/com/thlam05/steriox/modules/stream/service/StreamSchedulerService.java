package com.thlam05.steriox.modules.stream.service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

@Service
public class StreamSchedulerService {
    @Qualifier("threadPoolTaskScheduler")
    private final ThreadPoolTaskScheduler taskScheduler;
    private final StreamSocketService streamSocketService;

    public StreamSchedulerService(
            @Qualifier("threadPoolTaskScheduler") ThreadPoolTaskScheduler taskScheduler,
            StreamSocketService streamSocketService) {
        this.taskScheduler = taskScheduler;
        this.streamSocketService = streamSocketService;
    }

    private final Map<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    public void startHeartbeatTask(String livestreamId) {
        if (scheduledTasks.containsKey(livestreamId)) {
            System.out.println("Task for stream " + livestreamId + " is running.");
            return;
        }

        Runnable heartbeatJob = () -> {
            streamSocketService.cleanExpiredViews(livestreamId);
        };
        ScheduledFuture<?> futureTask = taskScheduler.scheduleAtFixedRate(heartbeatJob, Duration.ofSeconds(10));

        scheduledTasks.put(livestreamId, futureTask);
        System.out.println("Turn on scheduler for livestream: " + livestreamId);
    }

    public void stopHeartbeatTask(String livestreamId) {
        ScheduledFuture<?> futureTask = scheduledTasks.get(livestreamId);

        if (futureTask != null) {
            futureTask.cancel(true);

            scheduledTasks.remove(livestreamId);
            System.out.println("Turn off and cancle scheduler for livestream: " + livestreamId);
        } else {
            System.out.println("Not found task scheduler for livestream: " + livestreamId);
        }
    }
}
