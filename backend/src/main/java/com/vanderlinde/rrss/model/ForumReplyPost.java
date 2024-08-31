package com.vanderlinde.rrss.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.catalina.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "forum_reply_posts")

public class ForumReplyPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "forum_reply_post_id")
    private int forumReplyPostId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity author;

    @Column(nullable = false)
    private float rating ;

    @Column(nullable = false)
    private int communityCode ;

    @Column(nullable = false)
    private LocalDateTime time ;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String text ;

    public ForumReplyPost(String title, String text, UserEntity author) {
        this.title = title;
        this.text = text;
        this.author = author;
        this.time = LocalDateTime.now();
        this.rating = 0 ;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ForumPostId")
    @JsonBackReference
    private ForumPost replyTo;

}
