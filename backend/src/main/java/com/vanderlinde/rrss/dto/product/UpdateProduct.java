package com.vanderlinde.rrss.dto.product;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateProduct {

    private int productId;
    private String name;
    private double price;
    private MultipartFile image ;

}
