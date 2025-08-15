package com.money.SaveMe.Repo;

import com.money.SaveMe.Model.Currency;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface CurrencyRepo extends CrudRepository<Currency,Long> {

    @Query("SELECT c FROM Currency c WHERE c.user.id = ?1")
    Iterable<Currency> findAllCurrenciesByUserId(String userId);

    @Query("SELECT c FROM Currency c WHERE c.id = ?1 AND c.user.id = ?2")
    Optional<Currency> findCurrencyByIdAndUserId(Long id, String userUUID);

    @Transactional
    @Modifying
    @Query("DELETE FROM Currency c WHERE c.id = ?1 AND c.user.id = ?2")
    void deleteCurrencyByIdAndUserId(Long id, String userId);

}
