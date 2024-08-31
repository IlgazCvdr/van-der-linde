package com.vanderlinde.rrss.model;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "question_posts")

public class QuestionPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_post_id")
    private int questionPostId;

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

    public QuestionPost(String title, String text, UserEntity author) {
        this.title = title;
        this.text = text;
        this.author = author;
        this.time = LocalDateTime.now();
        this.rating = 0 ;
    }

    @OneToMany(mappedBy = "answerTo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<AnswerPost> answers = new ArrayList<>();

}
