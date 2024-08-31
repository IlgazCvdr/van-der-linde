package com.vanderlinde.rrss.repository;

import com.vanderlinde.rrss.model.Role;
import com.vanderlinde.rrss.model.UserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<UserEntity> findById(int id);
    @Query("SELECT DISTINCT u FROM UserEntity u JOIN u.roles r WHERE 'PENDING' = r.name")
    List<UserEntity> findUsersWithPendingRole();
}
