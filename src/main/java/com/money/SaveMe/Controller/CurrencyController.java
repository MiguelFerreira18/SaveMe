package com.money.SaveMe.Controller;

import com.money.SaveMe.Model.Currency;
import com.money.SaveMe.Service.CurrencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("currency")
public class CurrencyController {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @GetMapping("/{userUUID}/all")
    public ResponseEntity<Iterable<Currency>> getAllCurrencies(@PathVariable String userUUID) {
        Iterable<Currency> currencies = currencyService.getAllCurrenciesFromUser(userUUID);
        return ResponseEntity.ok(currencies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Currency> getCurrencyById(@PathVariable Long id,@RequestParam String userUUID) {
        Currency currency = currencyService.getCurrencyById(id, userUUID);
        if (currency == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(currency);
    }

    @PostMapping
    public ResponseEntity<Currency> saveCurrency(@RequestBody Currency currency) {
        Currency savedCurrency = currencyService.saveCurrency(currency);
        return ResponseEntity.status(201).body(savedCurrency);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCurrency(@PathVariable Long id, @RequestParam String userUUID) {
        currencyService.deleteCurrency(id, userUUID);
        return ResponseEntity.status(202).build();
    }

}
