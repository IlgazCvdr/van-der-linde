package com.vanderlinde.rrss.service;

import com.vanderlinde.rrss.model.Category;
import com.vanderlinde.rrss.repository.CategoryRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @PostConstruct
    public void init() {

        boolean electronicsCategoryExists = categoryRepository.existsByName("Electronics");
        boolean computersCategoryExists = categoryRepository.existsByName("Computers");
        boolean smartHomeCategoryExists = categoryRepository.existsByName("SmartHome");
        boolean automotiveCategoryExists = categoryRepository.existsByName("Automotive");
        boolean babyCategoryExists = categoryRepository.existsByName("Baby");
        boolean beautyCategoryExists = categoryRepository.existsByName("Beauty");
        boolean womanCategoryExists = categoryRepository.existsByName("Woman");
        boolean manCategoryExists = categoryRepository.existsByName("Man");
        boolean girlCategoryExists = categoryRepository.existsByName("Girl");
        boolean boyCategoryExists = categoryRepository.existsByName("Boy");
        boolean healthcareCategoryExists = categoryRepository.existsByName("Healthcare");
        boolean homeCategoryExists = categoryRepository.existsByName("Home");
        boolean petStoreCategoryExists = categoryRepository.existsByName("Pet Store");
        boolean sportsCategoryExists = categoryRepository.existsByName("Sports");
        boolean toysCategoryExists = categoryRepository.existsByName("Toys");
        boolean videoGameCategoryExists = categoryRepository.existsByName("Video Game");

        if(!electronicsCategoryExists) {
            saveCategory("Electronics");
        }
        if(!computersCategoryExists) {
            saveCategory("Computers");
        }
        if(!smartHomeCategoryExists) {
            saveCategory("SmartHome");
        }
        if(!automotiveCategoryExists) {
            saveCategory("Automotive");
        }
        if(!babyCategoryExists) {
            saveCategory("Baby");
        }
        if(!beautyCategoryExists) {
            saveCategory("Beauty");
        }
        if(!womanCategoryExists) {
            saveCategory("Woman");
        }
        if(!manCategoryExists) {
            saveCategory("Man");
        }
        if(!girlCategoryExists) {
            saveCategory("Girl");
        }
        if(!boyCategoryExists) {
            saveCategory("Boy");
        }
        if(!healthcareCategoryExists) {
            saveCategory("Healthcare");
        }
        if(!homeCategoryExists) {
            saveCategory("Home");
        }
        if(!petStoreCategoryExists) {
            saveCategory("Pet Store");
        }
        if(!sportsCategoryExists) {
            saveCategory("Sports");
        }
        if(!toysCategoryExists) {
            saveCategory("Toys");
        }
        if(!videoGameCategoryExists) {
            saveCategory("Video Game");
        }

    }
    public void saveCategory(String name){
        Category category = new Category();
        category.setName(name);
        categoryRepository.save(category);
    }
}
