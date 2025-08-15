package com.money.SaveMe.DTO.Income;

import java.math.BigDecimal;

public record IncomeOutputDto(
        String currencyName,
        String description,
        BigDecimal amount,
        String userId
) {
}
