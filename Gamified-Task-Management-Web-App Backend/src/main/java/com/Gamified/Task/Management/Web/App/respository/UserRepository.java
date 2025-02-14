package com.Gamified.Task.Management.Web.App.respository;

import com.Gamified.Task.Management.Web.App.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUsername(String username);
}
