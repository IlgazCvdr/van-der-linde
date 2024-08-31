package com.vanderlinde.rrss.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.xml.crypto.Data;
import java.util.ArrayList;
import java.util.List;
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "communities")
public class LocalCommunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "local_community_id")
    private int localCommunityId;

    @Column
    private byte[] icon ;

    @Column(nullable = false)
    private String name ;

    public LocalCommunity(String name) {
        this.name = name;
    }

    @OneToMany(mappedBy = "fromCommunity", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<LocalCommunityPost> communityPosts = new ArrayList<>();
}
