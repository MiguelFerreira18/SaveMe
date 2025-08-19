package com.money.SaveMe.DTO.Income;

import java.math.BigDecimal;

public record IncomeOutputDto(
        Long id,
        String symbol,
        String description,
        BigDecimal amount,
        String userId
) {
}
