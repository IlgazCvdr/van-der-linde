package com.vanderlinde.rrss.service;

import com.vanderlinde.rrss.dto.auth.UserDto;
import com.vanderlinde.rrss.dto.product.*;
import com.vanderlinde.rrss.dto.review.ReviewDto;
import com.vanderlinde.rrss.model.Category;
import com.vanderlinde.rrss.model.Product;
import com.vanderlinde.rrss.model.Review;
import com.vanderlinde.rrss.model.UserEntity;
import com.vanderlinde.rrss.repository.CategoryRepository;
import com.vanderlinde.rrss.repository.ProductRepository;
import com.vanderlinde.rrss.repository.ReviewRepository;
import com.vanderlinde.rrss.repository.UserRepository;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.*;

@Service
public class ProductService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserService userService;


    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    public ResponseEntity<String> createProduct(@RequestBody CreateProduct req) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<UserEntity> user = userService.getUser(authentication);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        if(!user.get().checkRole("MERCHANT")) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission");
        Product newProduct = new Product();
        newProduct.setName(req.getName());
        newProduct.setPrice(req.getPrice());
        newProduct.setMerchant(user.get());
        List<String> categoryNames = req.getCategories();
        List<Category> categories = new ArrayList<>();
        for (String categoryName : categoryNames) {
            if (categoryRepository.existsByName(categoryName)) {
                categories.add(categoryRepository.findByName(categoryName));
            }
        }
        newProduct.setCategories(categories);

        if (req.getImage() != null && !req.getImage().isEmpty()) {
            newProduct.setImage(req.getImage().getBytes());
        }

        productRepository.save(newProduct);
        return ResponseEntity.status(HttpStatus.CREATED).body("Product created");
    }

    public ResponseEntity<String> deleteProduct(@RequestBody DeleteProduct req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<UserEntity> user = userService.getUser(authentication);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        Optional<Product> optionalProduct = productRepository.findById(req.getProductId());
        if (optionalProduct.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No product found");
        Product product = optionalProduct.get();
        if(!product.getMerchant().getEmail().equals(user.get().getEmail()) && !user.get().checkRole("ADMIN")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorized to delete product");
        }
        for (UserEntity userEntity : product.getUsers()) {
            userEntity.getSearchedProducts().remove(product);
            userRepository.save(userEntity);
        }
        productRepository.deleteById(req.getProductId());
        return ResponseEntity.ok("Product deleted successfully");
    }

    public ResponseEntity<String> updateProduct(@RequestBody UpdateProduct req) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<UserEntity> user = userService.getUser(authentication);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        Optional<Product> optionalProduct = productRepository.findById(req.getProductId());
        if (optionalProduct.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No product found");
        Product product = optionalProduct.get();
        if(!product.getMerchant().getEmail().equals(user.get().getEmail()) && !user.get().checkRole("ADMIN")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorized to delete product");
        }

        if (req.getImage() != null && !req.getImage().isEmpty()) {
            product.setImage(req.getImage().getBytes());
        }

        product.setName(req.getName());
        product.setPrice(req.getPrice());
        productRepository.save(product);
        return ResponseEntity.ok("Product updated successfully");
    }

    public ResponseEntity<?> getProductRecommendations() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<UserEntity> user = userService.getUser(authentication);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        UserEntity userEntity = user.get();

        List<Product> productsToRecommend = new ArrayList<>();
        List<Review> userReviews = reviewRepository.findAllByUserId(userEntity.getId());

        for (Review review : userReviews) {
            Optional<Product> product = reviewRepository.findProductByReviewId(review.getId());
            if (product.isEmpty()) continue;
            Product productEntity = product.get();
            List<Category> categories = productEntity.getCategories();

            for (Category category : categories) {
                List<Product> recommendations = productRepository.findByCategoryId(category.getId());
                productsToRecommend.addAll(recommendations);
            }
        }
        productsToRecommend.addAll(userEntity.getSearchedProducts());
        Set<Product> uniqueProducts = new HashSet<>(productsToRecommend);
        List<ProductDto> productDtoList = new ArrayList<>();
        for (Product product : uniqueProducts) {
            productDtoList.add(convertProductToProductDto(product));
        }
        return ResponseEntity.ok(productDtoList);
    }

    public ResponseEntity<?> searchProducts(String query) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(query);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<UserEntity> user = userService.getUser(authentication);
        if(!user.isEmpty()){
            UserEntity userEntity = user.get();
            userEntity.getSearchedProducts().addAll(products);
            userRepository.save(userEntity);
        }
        List<ProductDto> productDtoList = new ArrayList<>();
        for (Product product : products) {
            productDtoList.add(convertProductToProductDto(product));
        }
        return ResponseEntity.ok(productDtoList);
    }

    private ProductDto convertProductToProductDto(Product product){
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setPrice(product.getPrice());
        productDto.setRating(product.getRating());
        UserDto userDto = product.getMerchant().convertToUserDto();
        productDto.setMerchant(userDto);
        return productDto;
    }

    public ResponseEntity<?> getProduct(int id){
        Optional<Product> product = productRepository.findById(id);
        if(product.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        ProductDto productDto = convertProductToProductDto(product.get());
        return ResponseEntity.status(HttpStatus.OK).body(productDto);
    }

    public ResponseEntity<?> getProductImage(int productId){
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if(optionalProduct.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        Product product = optionalProduct.get();
        byte[] image = product.getImage();
        if(image == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product image not found");
        return ResponseEntity.status(HttpStatus.OK).body(image);
    }

    public ResponseEntity<List<ProductDto>> getAllProducts(){
        List<Product> products = productRepository.findAll();
        List<ProductDto> productDtos = new ArrayList<>();
        for(Product product : products){
            productDtos.add(convertProductToProductDto(product));
        }
        return ResponseEntity.status(HttpStatus.OK).body(productDtos);
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

    public CategoryDto convertToCategoryDto(Category category){
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        return categoryDto;
    }

    public ResponseEntity<List<ReviewDto>> getProductReviews(@RequestParam int productId){
        Optional<Product> product = productRepository.findById(productId);
        if(product.isEmpty()) return null;
        List<Review> reviews = product.get().getReviews();
        reviews.sort(Comparator.comparing(Review::getCreated));
        List<ReviewDto> reviewDtos = new ArrayList<>();
        for(Review review : reviews){
            reviewDtos.add(convertToReviewDto(review));
        }
        return ResponseEntity.status(HttpStatus.OK).body(reviewDtos);
    }

    public ResponseEntity<List<ProductDto>> getProductsByCategoryName(@RequestParam String categoryName){
        List<Product> products = productRepository.findByCategoryName(categoryName);
        List<ProductDto> productDtos = new ArrayList<>();
        for(Product product : products){
            productDtos.add(convertProductToProductDto(product));
        }
        return ResponseEntity.status(HttpStatus.OK).body(productDtos);
    }

    public ResponseEntity<List<CategoryDto>> getProductCategories(@RequestParam int productId){
        Optional<Product> product = productRepository.findById(productId);
        if(product.isEmpty()) return null;
        List<Category> categories = product.get().getCategories();
        List<CategoryDto> categoryDtos = new ArrayList<>();
        for(Category category : categories){
            categoryDtos.add(convertToCategoryDto(category));
        }
        return ResponseEntity.status(HttpStatus.OK).body(categoryDtos);
    }
    
    public ResponseEntity<?> getProductByReviewId(@RequestParam int reviewId){
        Optional<Product> product = reviewRepository.findProductByReviewId(reviewId);
        if(product.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        ProductDto productDto = convertProductToProductDto(product.get());
        return ResponseEntity.status(HttpStatus.OK).body(productDto);
    }

    public ResponseEntity<?> getLastTenReview(@RequestParam int merchantId){
        ResponseEntity<String> isMerchantValid = checkMerchant(merchantId);
        if(isMerchantValid.getStatusCode() != HttpStatus.OK) return isMerchantValid;

        List<Review> reviews = reviewRepository.findAllByMerchantId(merchantId);
        if(reviews.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Merchant does not have any reviews");

        reviews.sort(Comparator.comparing(Review::getCreated));
        List<ReviewDto> reviewDtos = new ArrayList<>();
        int counter = 0 ;
        for(Review review : reviews){
            reviewDtos.add(review.convertToReviewDto());
            counter ++ ;
            if (counter==10) break ;
        }
        return ResponseEntity.status(HttpStatus.OK).body(reviewDtos);
    }

    public ResponseEntity<?> getWorstProduct(@RequestParam int merchantId){
        ResponseEntity<String> isMerchantValid = checkMerchant(merchantId);
        if(isMerchantValid.getStatusCode() != HttpStatus.OK) return isMerchantValid;

        List<Product> merchantProducts = productRepository.findAllByMerchantId(merchantId);
        if (merchantProducts.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Merchant does not have any products");
        merchantProducts.sort(Comparator.comparingDouble(Product::getRating));

        return ResponseEntity.status(HttpStatus.OK).body(merchantProducts.get(0).convertProductToProductDto());

    }

    public ResponseEntity<?> getBestProduct(@RequestParam int merchantId){
        ResponseEntity<String> isMerchantValid = checkMerchant(merchantId);
        if(isMerchantValid.getStatusCode() != HttpStatus.OK) return isMerchantValid;

        List<Product> merchantProducts = productRepository.findAllByMerchantId(merchantId);
        if (merchantProducts.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Merchant does not have any products");
        merchantProducts.sort(Comparator.comparingDouble(Product::getRating).reversed());

        return ResponseEntity.status(HttpStatus.OK).body(merchantProducts.get(0).convertProductToProductDto());
    }

    public ResponseEntity<?> getProductsSortedByRating(@RequestParam int merchantId) {

        ResponseEntity<String> isMerchantValid = checkMerchant(merchantId);
        if(isMerchantValid.getStatusCode() != HttpStatus.OK) return isMerchantValid;

        List<Product> merchantProducts = productRepository.findAllByMerchantId(merchantId);
        if (merchantProducts.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Merchant does not have any products");
        List<ProductDto> productDtos = new ArrayList<>();
        merchantProducts.sort(Comparator.comparingDouble(Product::getRating).reversed());

        for(Product product : merchantProducts){
            productDtos.add(product.convertProductToProductDto());
        }

        return ResponseEntity.status(HttpStatus.OK).body(productDtos);

    }

    public ResponseEntity<?> getMerchantProducts(@RequestParam int merchantId){
        ResponseEntity<String> isMerchantValid = checkMerchant(merchantId);
        if(isMerchantValid.getStatusCode() != HttpStatus.OK) return isMerchantValid;

        List<Product> merchantProducts = productRepository.findAllByMerchantId(merchantId);
        if(merchantProducts.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Merchant does not have any products");

        List<ProductDto> prodcutDtos = new ArrayList<>();
        for(Product product : merchantProducts){
            prodcutDtos.add(product.convertProductToProductDto());
        }
        return ResponseEntity.status(HttpStatus.OK).body(prodcutDtos);
    }

    public ResponseEntity<String> checkMerchant(int merchantId){
        Optional<UserEntity> optionalMerchant = userRepository.findById(merchantId);
        if(optionalMerchant.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        UserEntity merchant = optionalMerchant.get();
        if(!merchant.checkRole("MERCHANT")) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is not merchant");
        return ResponseEntity.status(HttpStatus.OK).body("Merchant is valid");
    }

}
