package com.money.SaveMe.init;

import com.money.SaveMe.DTO.Currency.SaveCurrencyDto;
import com.money.SaveMe.Model.Currency;
import com.money.SaveMe.Model.User;
import com.money.SaveMe.Repo.CurrencyRepo;
import com.money.SaveMe.Service.CurrencyService;
import com.money.SaveMe.Service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Order(BootstrapOrder.CURRENCIES)
@Profile("dev")
public class CurrencyBootstrap implements CommandLineRunner {
    private final UserService userService;
    private final CurrencyRepo currencyRepo;

    public CurrencyBootstrap(UserService userService, CurrencyRepo currencyRepo) {
        this.userService = userService;
        this.currencyRepo = currencyRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        User u1 = userService.getUserByEmail("coisa@gmail.com");
        SaveCurrencyDto eur = new SaveCurrencyDto("EUR", "€");
        SaveCurrencyDto usd = new SaveCurrencyDto("USD", "$");

        if (currencyRepo.findByNameAndSymbolAndUserId("EUR", "€", u1.getId()).isEmpty()) {
            Currency euroCurrency = new Currency(u1, eur.name(), eur.symbol());
           Currency c = currencyRepo.save(euroCurrency);
            System.out.println("Saved currency: " + c.getName() + " for user: " + u1.getEmail());
        }
        if (currencyRepo.findByNameAndSymbolAndUserId("USD", "$", u1.getId()).isEmpty()) {
            Currency usdCurrency = new Currency(u1, usd.name(), usd.symbol());
            currencyRepo.save(usdCurrency);
        }

        User u2 = userService.getUserByEmail("coisa2@gmail.com");
        if (currencyRepo.findByNameAndSymbolAndUserId("EUR", "€", u2.getId()).isEmpty()) {
            Currency euroCurrency = new Currency(u2, eur.name(), eur.symbol());
            currencyRepo.save(euroCurrency);
        }
    }

}
