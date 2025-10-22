package com.money.SaveMe.Service;

import com.money.SaveMe.DTO.Investment.SaveInvestmentDto;
import com.money.SaveMe.DTO.Investment.UpdateInvestmentDto;
import com.money.SaveMe.Model.*;
import com.money.SaveMe.Repo.*;
import com.money.SaveMe.Utils.AuthenticationServiceUtil;
import org.springframework.stereotype.Service;

@Service
public class InvestmentService {

    private final InvestmentRepo investmentRepo;
    private final AuthenticationServiceUtil authUtil;
    private final CurrencyRepo currencyRepo;
    private final UserRepo userRepo;
    private final StrategyTypeRepo strategyTypeRepo;

    public InvestmentService(InvestmentRepo investmentRepo, AuthenticationServiceUtil authUtil, CurrencyRepo currencyRepo, UserRepo userRepo, StrategyTypeRepo strategyTypeRepo) {
        this.investmentRepo = investmentRepo;
        this.authUtil = authUtil;
        this.currencyRepo = currencyRepo;
        this.userRepo = userRepo;
        this.strategyTypeRepo = strategyTypeRepo;
    }

    public Iterable<Investment> getAllInvestments(){
        String userId = authUtil.getCurrentUserUuid();
        return investmentRepo.findAllInvestmentsByUserId(userId);
    }

    public Investment getInvestmentById(Long id){
        String userId = authUtil.getCurrentUserUuid();
        return investmentRepo.findByInvestmentIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Investment not found with id: " + id + " for user: " + userId));
    }

    public Investment saveInvestment(SaveInvestmentDto investmentDto) {
        String userId = authUtil.getCurrentUserUuid();
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with UUID: " + userId));

        Currency currency = currencyRepo.findCurrencyByIdAndUserId(investmentDto.currencyId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Currency not found with id: " + investmentDto.currencyId() + " for user: " + userId));

        StrategyType strategyType = strategyTypeRepo.findStrategyTypeByIdAndUserId(investmentDto.strategyTypeId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Strategy type not found with id: " + investmentDto.strategyTypeId() + " for user: " + userId));

        Investment newInvestment = new Investment(user,currency,investmentDto.amount(), strategyType,investmentDto.description(),investmentDto.date());

        return investmentRepo.save(newInvestment);
    }

    public Investment updateInvestment(UpdateInvestmentDto updateInvestment) {
        String userId = authUtil.getCurrentUserUuid();

        Currency currency = currencyRepo.findCurrencyByIdAndUserId(updateInvestment.currencyId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Currency not found with id: " + updateInvestment.currencyId() + " for user: " + userId));

        StrategyType strategyType = strategyTypeRepo.findStrategyTypeByIdAndUserId(updateInvestment.strategyTypeId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Strategy type not found with id: " + updateInvestment.strategyTypeId() + " for user: " + userId));

        Investment oldInvestment = investmentRepo.findByInvestmentIdAndUserId(updateInvestment.id(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Investment not found with id: " + updateInvestment.id() + " for user: " + userId));

        oldInvestment.setAmount(updateInvestment.amount());
        oldInvestment.setCurrency(currency);
        oldInvestment.setStrategyType(strategyType);
        oldInvestment.setDescription(updateInvestment.description());
        oldInvestment.setDate(updateInvestment.date());

        return investmentRepo.save(oldInvestment);
    }

    public void deleteInvestment(Long id) {
        String userId = authUtil.getCurrentUserUuid();
        investmentRepo.deleteInvestmentByIdAndUserId(id, userId);
    }
}
