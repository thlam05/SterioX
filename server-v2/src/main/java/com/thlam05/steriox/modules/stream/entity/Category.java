package com.thlam05.steriox.modules.stream.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.thlam05.steriox.common.model.BaseModel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "categories")
@Table(name = "categories")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Category extends BaseModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    String id;

    @Column(name = "name")
    String name;

    @Column(name = "parent_id")
    String parentId;

    @Column(name = "slug")
    String slug;

    @Column(name = "level")
    int level;

    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    Set<Stream> streams;
}
