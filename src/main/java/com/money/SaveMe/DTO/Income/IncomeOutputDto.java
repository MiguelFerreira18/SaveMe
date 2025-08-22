package com.money.SaveMe.DTO.Income;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record IncomeOutputDto(
        Long id,
        String symbol,
        String description,
        BigDecimal amount,
        String userId,
        LocalDate date
) {
}
