package com.money.SaveMe.DTO.Expense;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseOutDto(
        Long id,
        String category,
        String symbol,
        BigDecimal amount,
        String userId,
        LocalDate date
) {
}
