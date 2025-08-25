package com.money.SaveMe.DTO.Category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SaveCategoryDto(
        @NotNull @NotBlank String name,
        @NotNull @NotBlank String description) {

}
