package com.vanderlinde.rrss.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.vanderlinde.rrss.dto.auth.UserDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private byte[] image ;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private List<Role> roles = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_searched_products", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    @JsonManagedReference
    private Set<Product> searchedProducts = new HashSet<>();

    public UserEntity(String email, String password, String lastName, String firstName, int id) {
        this.email = email;
        this.password = password;
        this.lastName = lastName;
        this.firstName = firstName;
        this.id = id;
    }

    @Transient
    public UserDto convertToUserDto() {
        UserDto userDto = new UserDto();
        userDto.setFirstName(firstName);
        userDto.setLastName(lastName);
        userDto.setId(id);
        userDto.setEmail(email);
        List<String> roleNames = new ArrayList<>();
        for (Role role : roles) {
            roleNames.add(role.getName().toLowerCase(Locale.ENGLISH));
        }
        userDto.setRoleNames(roleNames);
        return userDto;
    }

    @Transient
    public boolean checkRole(String roleName){
        for (Role role : roles) {
            if(role.getName().equals(roleName)){
                return true;
            }
        }
        return false;
    }

    @Transient
    public void removeRole(String roleName){
        roles.removeIf(role -> role.getName().equals(roleName));
    }

}