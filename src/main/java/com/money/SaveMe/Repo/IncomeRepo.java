package com.money.SaveMe.Repo;

import com.money.SaveMe.Model.Income;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncomeRepo extends CrudRepository<Income, Long> {

    @Query("SELECT i FROM Income i where i.user.id = ?1 and i.currency.id = ?2")
    public Iterable<Income> findAllIncomeByUserIdFromCurrency(Long userId, Long currencyId);

}
