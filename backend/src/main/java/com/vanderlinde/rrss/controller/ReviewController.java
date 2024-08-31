package com.vanderlinde.rrss.controller;

import com.vanderlinde.rrss.dto.review.CreateReviewRequest;
import com.vanderlinde.rrss.dto.review.DeleteReviewRequest;
import com.vanderlinde.rrss.dto.review.ReviewDto;
import com.vanderlinde.rrss.dto.review.UpdateReviewRequest;
import com.vanderlinde.rrss.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    ReviewService reviewService;

    @GetMapping("/get")
    public ResponseEntity<ReviewDto> getReview(@RequestParam int reviewId){
       return reviewService.getReview(reviewId);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createReview(@RequestParam("productId") int productId,
                                               @RequestParam("text") String text,
                                               @RequestParam("rating") int rating,
                                               @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        CreateReviewRequest req = new CreateReviewRequest();
        req.setProductId(productId);
        req.setText(text);
        req.setRating(rating);
        req.setImage(image);
        return reviewService.createReview(req);
    }

    @GetMapping("/get-image")
    public ResponseEntity<?> getReviewImage(@RequestParam int reviewId) {
        return reviewService.getReviewImage(reviewId);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReviewDto>> getAllReviews(){
        return reviewService.getAllReviews();
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteReview(@RequestBody DeleteReviewRequest req){
        return reviewService.deleteReview(req);
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateReview( @RequestParam("reviewId") int reviewId,
                                                @RequestParam("text") String text,
                                                @RequestParam("rating") int rating,
                                                @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        UpdateReviewRequest req = new UpdateReviewRequest();
        req.setReviewId(reviewId);
        req.setText(text);
        req.setRating(rating);
        req.setImage(image); // manually set the image in the DTO
        return reviewService.updateReview(req);
    }
}
