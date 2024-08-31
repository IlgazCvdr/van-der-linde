package com.vanderlinde.rrss.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "local_community_posts")
public class LocalCommunityPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "community_post_id")
    private int communityPostId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity author;

    @Column(nullable = false)
    private float rating ;

    @Column(nullable = false)
    private LocalDateTime time ;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String text ;

    @Column
    private byte[] image ;

    public LocalCommunityPost(String title, String text, UserEntity author) {
        this.title = title;
        this.text = text;
        this.author = author;
        this.time = LocalDateTime.now();
        this.rating = 0 ;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "localCommunityId")
    @JsonBackReference
    private LocalCommunity fromCommunity;
}
