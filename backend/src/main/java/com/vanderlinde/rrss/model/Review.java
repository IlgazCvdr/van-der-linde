package com.vanderlinde.rrss.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.vanderlinde.rrss.dto.review.ReviewDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String text;

    private byte[] image ;

    private int rating = 0;

    Date created = new Date();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity author;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;

    @Transient
    public ReviewDto convertToReviewDto(){
        ReviewDto reviewDto = new ReviewDto();
        reviewDto.setId(id);
        reviewDto.setText(text);
        reviewDto.setRating(rating);
        reviewDto.setCreated(created);
        reviewDto.setProduct(product.convertProductToProductDto());
        reviewDto.setUser(author.convertToUserDto());
        return reviewDto;
    }

}
