package com.vanderlinde.rrss.repository;

import com.vanderlinde.rrss.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByName(String name);

    boolean existsByName(String name);
}
