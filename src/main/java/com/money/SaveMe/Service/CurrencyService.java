package com.money.SaveMe.Service;

import com.money.SaveMe.Model.Currency;
import com.money.SaveMe.Repo.CurrencyRepo;
import org.springframework.stereotype.Service;

@Service
public class CurrencyService {
    private final CurrencyRepo currencyRepo;

    public CurrencyService(CurrencyRepo currencyRepo) {
        this.currencyRepo = currencyRepo;
    }

    public Iterable<Currency> getAllCurrenciesFromUser(String userUUID) {
        return currencyRepo.findAllCurrenciesByUserId(userUUID);
    }

    public Currency getCurrencyById(Long id, String userUUID) {
        return currencyRepo.findCUrrencyByIdAndUserId(id, userUUID)
                .orElse(null);
    }

    public Currency saveCurrency(Currency currency) {
        return currencyRepo.save(currency);
    }

    public void deleteCurrency(Long id, String userUUID) {
        currencyRepo.deleteById(id);
    }

    public boolean currencyExists(Long id) {
        return currencyRepo.existsById(id);
    }

}
