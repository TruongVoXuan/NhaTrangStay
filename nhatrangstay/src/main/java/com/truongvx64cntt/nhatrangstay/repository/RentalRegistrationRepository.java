package com.truongvx64cntt.nhatrangstay.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.truongvx64cntt.nhatrangstay.entity.Post;
import com.truongvx64cntt.nhatrangstay.entity.RentalRegistration;
import com.truongvx64cntt.nhatrangstay.entity.User;

public interface RentalRegistrationRepository
        extends JpaRepository<RentalRegistration, Long> {

    Optional<RentalRegistration> findByUserAndPost(User user, Post post);

}
