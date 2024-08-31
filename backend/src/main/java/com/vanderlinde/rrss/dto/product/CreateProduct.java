package com.vanderlinde.rrss.dto.product;

import com.vanderlinde.rrss.model.Category;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class CreateProduct {
    private String name;
    private double price;
    private MultipartFile image ;
    private List<String> categories;
}
