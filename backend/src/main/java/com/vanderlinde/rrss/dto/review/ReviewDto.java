package com.vanderlinde.rrss.dto.review;

import com.vanderlinde.rrss.dto.auth.UserDto;
import com.vanderlinde.rrss.dto.product.ProductDto;
import com.vanderlinde.rrss.model.Product;
import lombok.Data;

import java.util.Date;

@Data
public class ReviewDto {
    private int id;
    private String text;
    private int rating;
    private Date Created;
    private UserDto user;
    private ProductDto product;

}
