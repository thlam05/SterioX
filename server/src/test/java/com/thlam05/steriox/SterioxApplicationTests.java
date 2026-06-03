package com.thlam05.steriox;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.Test;

class SterioxApplicationTests {

	@Test
	void applicationMainMethodIsCallable() {
		assertDoesNotThrow(() -> SterioxApplication.class.getDeclaredMethod("main", String[].class));
	}

}
