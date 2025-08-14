package com.money.SaveMe.Repo;

import com.money.SaveMe.Model.Authority;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface AuthorityRepo extends CrudRepository<Authority, Long> {

    @Query("SELECT a FROM Authority a WHERE a.authority = ?1")
    Optional<Authority> findByAuthority(Authority.Role authority);


}
