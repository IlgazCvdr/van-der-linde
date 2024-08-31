package com.vanderlinde.rrss.service;

import com.vanderlinde.rrss.dto.auth.UserDto;
import com.vanderlinde.rrss.dto.review.CreateReviewRequest;
import com.vanderlinde.rrss.dto.review.DeleteReviewRequest;
import com.vanderlinde.rrss.dto.review.ReviewDto;
import com.vanderlinde.rrss.dto.review.UpdateReviewRequest;
import com.vanderlinde.rrss.model.Product;
import com.vanderlinde.rrss.model.Review;
import com.vanderlinde.rrss.model.UserEntity;
import com.vanderlinde.rrss.repository.ProductRepository;
import com.vanderlinde.rrss.repository.ReviewRepository;
import com.vanderlinde.rrss.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    ReviewRepository reviewRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UserRepository userRepository;


    public ResponseEntity<String> createReview(@ModelAttribute CreateReviewRequest req) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        Optional<Product> optionalProduct = productRepository.findById(req.getProductId());
        if(optionalProduct.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product not found");
        Product product = optionalProduct.get();
        int reviewCount = product.getReviews().size();
        double ratingSum = product.getRating() * reviewCount;
        ratingSum += req.getRating();
        product.setRating(ratingSum / (reviewCount + 1));
        productRepository.save(product);
        Review newReview = new Review();
        newReview.setProduct(product);
        newReview.setText(req.getText());
        newReview.setAuthor(user.get());
        newReview.setRating(req.getRating());

        if (req.getImage() != null && !req.getImage().isEmpty()) {
            newReview.setImage(req.getImage().getBytes());
        }

        reviewRepository.save(newReview);
        return ResponseEntity.status(HttpStatus.CREATED).body("Review created");
    }

    public ResponseEntity<ReviewDto> getReview(int reviewId){
        Optional<Review> optionalReview = reviewRepository.findById(reviewId);
        if(optionalReview.isEmpty()) return null;
        Review review = optionalReview.get();
        return ResponseEntity.status(HttpStatus.OK).body(review.convertToReviewDto());
    }

    public ResponseEntity<?> getReviewImage(int reviewId){
        Optional<Review> optionalReview = reviewRepository.findById(reviewId);
        if(optionalReview.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found");
        Review review = optionalReview.get();
        byte[] image = review.getImage();
        if(image == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found");
        return ResponseEntity.status(HttpStatus.OK).body(image);
    }

    private ReviewDto convertToReviewDto(Review review){
        UserDto userDto = new UserDto();
        userDto.setId(review.getAuthor().getId());
        userDto.setEmail(review.getAuthor().getEmail());
        userDto.setFirstName(review.getAuthor().getFirstName());
        userDto.setLastName(review.getAuthor().getLastName());
        ReviewDto reviewDto = new ReviewDto();
        reviewDto.setId(review.getId());
        reviewDto.setText(review.getText());
        reviewDto.setUser(userDto);
        reviewDto.setRating(review.getRating());
        reviewDto.setCreated(review.getCreated());
        return reviewDto;
    }

    public ResponseEntity<List<ReviewDto>> getAllReviews(){
        List<Review> reviews = reviewRepository.findAll();
        List<ReviewDto> reviewDtos = new ArrayList<>();
        for(Review review : reviews){
            reviewDtos.add(convertToReviewDto(review));
        }
        return ResponseEntity.status(HttpStatus.OK).body(reviewDtos);
    }

    public ResponseEntity<String> deleteReview(@RequestBody DeleteReviewRequest req){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        Optional<Review> review = reviewRepository.findById(req.getReviewId());
        if(review.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Review not found");
        Optional<Product> optionalProduct = productRepository.findById(review.get().getProduct().getId());
        if(optionalProduct.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product not found");
        Review reviewToDelete = review.get();
        if(!reviewToDelete.getAuthor().getEmail().equals(userEmail) && !user.get().checkRole("ADMIN")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorized to delete review");
        }
        Product product = optionalProduct.get();
        int reviewCount = product.getReviews().size();
        double ratingSum = (product.getRating() * reviewCount) - reviewToDelete.getRating();
        if(reviewCount == 1) product.setRating(0);
        else product.setRating(ratingSum / (reviewCount - 1));
        product.getReviews().remove(reviewToDelete);
        productRepository.save(product);
        reviewRepository.delete(reviewToDelete);
        return ResponseEntity.status(HttpStatus.OK).body("Review deleted");
    }

    public ResponseEntity<String> updateReview(@RequestBody UpdateReviewRequest req) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        Optional<Review> review = reviewRepository.findById(req.getReviewId());
        if(review.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Review not found");
        Optional<Product> optionalProduct = productRepository.findById(review.get().getProduct().getId());
        if(optionalProduct.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product not found");
        Review reviewToUpdate = review.get();
        if(!reviewToUpdate.getAuthor().getEmail().equals(userEmail) && !user.get().checkRole("ADMIN")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorized to update review");
        }
        Product product = optionalProduct.get();
        int reviewCount = product.getReviews().size();
        double ratingSum = (product.getRating() * reviewCount) - reviewToUpdate.getRating();
        ratingSum += req.getRating();
        product.setRating(ratingSum / reviewCount);
        productRepository.save(product);
        reviewToUpdate.setText(req.getText());
        reviewToUpdate.setRating(req.getRating());
        if (req.getImage() != null) {
            reviewToUpdate.setImage(req.getImage().getBytes());
        }
        reviewRepository.save(reviewToUpdate);
        return ResponseEntity.status(HttpStatus.OK).body("Review updated");
    }

}
