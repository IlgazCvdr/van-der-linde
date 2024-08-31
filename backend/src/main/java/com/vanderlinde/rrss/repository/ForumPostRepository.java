package com.vanderlinde.rrss.repository;

import com.vanderlinde.rrss.model.ForumPost;
import org.springframework.stereotype.Repository;

@Repository
public interface ForumPostRepository extends CrudRepository<ForumPost, Integer> {}