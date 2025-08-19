package com.money.SaveMe.Controller;

import com.money.SaveMe.DTO.Income.IncomeOutputDto;
import com.money.SaveMe.DTO.Income.SaveIncomeDto;
import com.money.SaveMe.DTO.Income.UpdateIncomeDto;
import com.money.SaveMe.Model.Income;
import com.money.SaveMe.Service.IncomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/income")
public class IncomeController {
    private IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping("/all/{currencyId}")
    public ResponseEntity<Iterable<IncomeOutputDto>> getAllIncomeByUserIdFromCurrency(@PathVariable Long currencyId) {
        Iterable<Income> incomes = incomeService.getAllIncomeByUserIdFromCurrency(currencyId);

        if (incomes == null || !incomes.iterator().hasNext()) {
            return ResponseEntity.notFound().build();
        }

        Iterable<IncomeOutputDto> incomeOutputDtos = StreamSupport.stream(incomes.spliterator(), true).map(
                income -> new IncomeOutputDto(
                        income.getId(),
                        income.getCurrency().getName(),
                        income.getDescription(),
                        income.getAmount(),
                        income.getUser().getId()
                )
        ).toList();

        return ResponseEntity.ok(incomeOutputDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeOutputDto> getIncomeById(@PathVariable Long incomeId){
        Income income = incomeService.getIncomeById(incomeId);

        if (income == null) {
            return ResponseEntity.notFound().build();
        }

        IncomeOutputDto incomeOutputDto = new IncomeOutputDto(
                income.getId(),
                income.getCurrency().getName(),
                income.getDescription(),
                income.getAmount(),
                income.getUser().getId()
        );

        return ResponseEntity.ok(incomeOutputDto);
    }

    @PostMapping("/")
    public ResponseEntity<IncomeOutputDto> saveIncome(@RequestBody SaveIncomeDto income) {
        Income savedIncome = incomeService.saveIncome(income);

        if (savedIncome == null) {
            return ResponseEntity.badRequest().build();
        }

        IncomeOutputDto incomeOutputDto = new IncomeOutputDto(
                savedIncome.getId(),
                savedIncome.getCurrency().getName(),
                savedIncome.getDescription(),
                savedIncome.getAmount(),
                savedIncome.getUser().getId()
        );

        return ResponseEntity.ok(incomeOutputDto);
    }

    @PutMapping("/")
    public ResponseEntity<IncomeOutputDto> updateIncome(@RequestBody UpdateIncomeDto income){
        Income updatedIncome = incomeService.updateIncome(income);

        if (updatedIncome == null) {
            return ResponseEntity.badRequest().build();
        }

        IncomeOutputDto incomeOutputDto = new IncomeOutputDto(
                updatedIncome.getId(),
                updatedIncome.getCurrency().getName(),
                updatedIncome.getDescription(),
                updatedIncome.getAmount(),
                updatedIncome.getUser().getId()
        );

        return ResponseEntity.ok(incomeOutputDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.status(202).build();
    }



}
