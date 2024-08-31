package com.vanderlinde.rrss.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.catalina.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "user_contents")

public class UserContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_content_id")
    private int userContentId;

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
    private byte[] image;

    public UserContent(String title, String text, UserEntity author, byte[] image) {

        this.title = title;
        this.text = text;
        this.author = author;
        this.time = LocalDateTime.now();
        this.rating = 0 ;
        this.image = image;
    }
}

