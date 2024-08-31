package com.vanderlinde.rrss.controller;

import com.vanderlinde.rrss.dto.product.*;
import com.vanderlinde.rrss.dto.review.ReviewDto;
import com.vanderlinde.rrss.dto.review.UpdateReviewRequest;
import com.vanderlinde.rrss.model.Category;
import com.vanderlinde.rrss.model.Product;
import com.vanderlinde.rrss.repository.ProductRepository;
import com.vanderlinde.rrss.service.ProductService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/product")
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductService productService;

    @PostMapping("/create")
    public ResponseEntity<String> createProduct(@RequestParam("name") String name,
                                                @RequestParam("price") int price,
                                                @RequestParam("categories") List<String> categories,
                                                @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        CreateProduct req = new CreateProduct();
        req.setName(name);
        req.setPrice(price);
        req.setCategories(categories);
        req.setImage(image);
        return productService.createProduct(req);
    }
    @PostMapping("/delete")
    public ResponseEntity<String> deleteProduct(@RequestBody DeleteProduct req) {
        return productService.deleteProduct(req);
    }

    @PatchMapping("/update")
    public ResponseEntity<String> updateProduct(@RequestParam("productId") int productId,
                                                @RequestParam("name") String name,
                                                @RequestParam("price") int price,
                                                @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        UpdateProduct req = new UpdateProduct();
        req.setProductId(productId);
        req.setName(name);
        req.setPrice(price);
        req.setImage(image);
        return productService.updateProduct(req);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getProduct(@RequestParam int productId) {
        return productService.getProduct(productId);
    }

    @GetMapping("/get-image")
    public ResponseEntity<?> getProductImage(@RequestParam int productId) {
        return productService.getProductImage(productId);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProductDto>> getAllProduct() {
        return productService.getAllProducts();
    }

    @GetMapping("/get-reviews")
    public ResponseEntity<List<ReviewDto>> getProductReviews(@RequestParam int productId){
        return productService.getProductReviews(productId);
    }

    @GetMapping("/get-recommendations")
    public ResponseEntity<?> getRecommendations(){
        return productService.getProductRecommendations();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(@RequestParam("q") String query) {
        return productService.searchProducts(query);
    }

    @GetMapping("/get-category")
    public ResponseEntity<List<ProductDto>> getProductsByCategoryName(@RequestParam String categoryName){
        return productService.getProductsByCategoryName(categoryName);
    }

    @GetMapping("/get-all-categories")
    public ResponseEntity<List<Category>> getAllCategories(){
        return productService.getCategories();
    }

    @GetMapping("/get-categories")
    public ResponseEntity<List<CategoryDto>> getCategories(@RequestParam int productId){
        return productService.getProductCategories(productId);
    }

    @GetMapping("/get-by-reviewId")
    public ResponseEntity<?> getProductByReviewId(@RequestParam int reviewId){
        return productService.getProductByReviewId(reviewId); 
    }
    
    @GetMapping("/get-last-10-review")
    public ResponseEntity<?> getLastTenReview(@RequestParam int merchantId) {
        return productService.getLastTenReview(merchantId) ;
    }

    @GetMapping("/get-worst-product")
    public ResponseEntity<?> getWorstProduct(@RequestParam int merchantId) {
        return productService.getWorstProduct(merchantId) ;
    }

    @GetMapping("/get-best-product")
    public ResponseEntity<?> getBestProduct(@RequestParam int merchantId) {
        return productService.getBestProduct(merchantId) ;
    }

    @GetMapping("get-products-sorted-by-rating")
    public ResponseEntity<?> getProductsSortedByRating(@RequestParam int merchantId) {
        return productService.getProductsSortedByRating(merchantId) ;
    }

    @GetMapping("/get-merchant-products")
    public ResponseEntity<?> getMerchantProducts(@RequestParam int merchantId) {
        return productService.getMerchantProducts(merchantId);
    }

}
