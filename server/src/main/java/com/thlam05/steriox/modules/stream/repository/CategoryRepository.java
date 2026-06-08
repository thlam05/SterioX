package com.thlam05.steriox.modules.stream.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thlam05.steriox.modules.stream.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, String> {
}
