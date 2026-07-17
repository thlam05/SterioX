package com.thlam05.steriox;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableRabbit
public class SterioxApplication {

	public static void main(String[] args) {
		SpringApplication.run(SterioxApplication.class, args);
	}

}
