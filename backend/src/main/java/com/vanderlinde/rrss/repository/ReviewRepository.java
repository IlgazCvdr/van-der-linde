package com.vanderlinde.rrss.repository;

import com.vanderlinde.rrss.model.Product;
import com.vanderlinde.rrss.model.Review;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends CrudRepository<Review, Integer> {
    @Query("SELECT r FROM Review r WHERE r.author.id = :userId")
    List<Review> findAllByUserId(@Param("userId") int userId);
    @Query("SELECT r.product FROM Review r WHERE r.id = :reviewId")
    Optional<Product> findProductByReviewId(@Param("reviewId") int reviewId);

    @Query("SELECT r FROM Review r WHERE r.product.merchant.id = :merchantId")
    List<Review> findAllByMerchantId(@Param("merchantId") int merchantId);

}
