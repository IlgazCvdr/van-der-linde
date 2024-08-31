package com.vanderlinde.rrss.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.vanderlinde.rrss.dto.auth.UserDto;
import com.vanderlinde.rrss.dto.product.ProductDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    private double rating = 0;

    @Column(nullable = false)
    private double price;

    @Column
    private byte[] image ;

    @ManyToOne(fetch = FetchType.EAGER)
    private UserEntity merchant;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Review> reviews = new ArrayList<>();

    @Getter
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinTable(name = "product_categories", joinColumns = @JoinColumn(name = "product_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "id"))
    private List<Category> categories = new ArrayList<>();

    @ManyToMany(mappedBy = "searchedProducts")
    @JsonBackReference
    private Set<UserEntity> users = new HashSet<>();

    @Transient
    public ProductDto convertProductToProductDto(){
        ProductDto productDto = new ProductDto();
        productDto.setId(id);
        productDto.setName(name);
        productDto.setPrice(price);
        productDto.setRating(rating);
        UserDto userDto = merchant.convertToUserDto();
        productDto.setMerchant(userDto);
        return productDto;
    }
}
