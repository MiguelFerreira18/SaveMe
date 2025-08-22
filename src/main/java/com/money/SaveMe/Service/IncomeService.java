package com.money.SaveMe.Service;

import com.money.SaveMe.DTO.Income.SaveIncomeDto;
import com.money.SaveMe.DTO.Income.UpdateIncomeDto;
import com.money.SaveMe.Model.Currency;
import com.money.SaveMe.Model.Income;
import com.money.SaveMe.Model.User;
import com.money.SaveMe.Repo.CurrencyRepo;
import com.money.SaveMe.Repo.IncomeRepo;
import com.money.SaveMe.Repo.UserRepo;
import com.money.SaveMe.Utils.AuthenticationServiceUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IncomeService {
    private IncomeRepo incomeRepo;
    private AuthenticationServiceUtil authenticationServiceUtil;
    private UserRepo userRepo;
    private CurrencyRepo currencyRepo;

    public IncomeService(IncomeRepo incomeRepo, AuthenticationServiceUtil authenticationServiceUtil, UserRepo userRepo, CurrencyRepo currencyRepo) {
        this.incomeRepo = incomeRepo;
        this.authenticationServiceUtil = authenticationServiceUtil;
        this.userRepo = userRepo;
        this.currencyRepo = currencyRepo;
    }

    //CRUD

    public Iterable<Income> getAllIncomeByUserId() {
        String userId = authenticationServiceUtil.getCurrentUserUuid();
        return incomeRepo.findAllIncomeByUserId(userId);
    }

    public Income getIncomeById(Long id) {
        String userId = authenticationServiceUtil.getCurrentUserUuid();
        return incomeRepo.findByIncomeIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException(STR."Income not found with id: \{id} for user: \{userId}"));
    }

    public Income saveIncome(SaveIncomeDto income) {
        String userId = authenticationServiceUtil.getCurrentUserUuid();
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(STR."User not found with UUID: \{userId}"));

        Currency currency = currencyRepo.findCurrencyByIdAndUserId(income.currencyId(), userId)
                .orElseThrow(() -> new IllegalArgumentException(STR."Currency not found with id: \{income.currencyId()} for user: \{userId}"));

        Income newIncome = new Income(user, currency, income.amount(), income.description(), income.date());

        return incomeRepo.save(newIncome);
    }

    public Income updateIncome(UpdateIncomeDto updatedIncomeDto) {
        String userId = authenticationServiceUtil.getCurrentUserUuid();

        Currency currency = currencyRepo.findCurrencyByIdAndUserId(updatedIncomeDto.currencyId(), userId)
                .orElseThrow(() -> new IllegalArgumentException(STR."Currency not found with id: \{updatedIncomeDto.currencyId()} for user: \{userId}"));

        Income oldIncome = incomeRepo.findByIncomeIdAndUserId(updatedIncomeDto.id(), userId)
                .orElseThrow(() -> new RuntimeException(STR."Income not found with id: \{updatedIncomeDto.id()} for user: \{userId}"));

        oldIncome.setAmount(updatedIncomeDto.amount());
        oldIncome.setDescription(updatedIncomeDto.description());
        oldIncome.setCurrency(currency);

        return incomeRepo.save(oldIncome);
    }

    public void deleteIncome(Long id) {
        String userId = authenticationServiceUtil.getCurrentUserUuid();

        if (!incomeRepo.findByIncomeIdAndUserId(id, userId).isPresent()) {
            throw new RuntimeException(STR."Income not found with id: \{id} for user: \{userId}");
        }

        incomeRepo.deleteIncomeByIdAndUserId(id, userId);
    }


}
