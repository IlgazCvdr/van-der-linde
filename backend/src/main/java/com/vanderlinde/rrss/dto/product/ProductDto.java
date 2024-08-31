package com.vanderlinde.rrss.dto.product;

import com.vanderlinde.rrss.dto.auth.UserDto;
import lombok.Data;

@Data
public class ProductDto {

    private int id;
    private String name;
    private double price;
    private double rating;
    private UserDto merchant;

}
