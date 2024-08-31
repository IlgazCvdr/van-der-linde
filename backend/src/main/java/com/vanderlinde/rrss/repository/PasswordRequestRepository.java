package com.vanderlinde.rrss.repository;

import com.vanderlinde.rrss.model.PasswordRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordRequestRepository  extends JpaRepository<PasswordRequestEntity, Integer> {
}
