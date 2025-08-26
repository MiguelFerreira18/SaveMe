package com.money.SaveMe.Service;

import com.money.SaveMe.DTO.Expense.SaveExpenseDto;
import com.money.SaveMe.DTO.Expense.UpdateExpenseDto;
import com.money.SaveMe.Model.Category;
import com.money.SaveMe.Model.Currency;
import com.money.SaveMe.Model.Expense;
import com.money.SaveMe.Model.User;
import com.money.SaveMe.Repo.CategoryRepo;
import com.money.SaveMe.Repo.CurrencyRepo;
import com.money.SaveMe.Repo.ExpenseRepo;
import com.money.SaveMe.Repo.UserRepo;
import com.money.SaveMe.Utils.AuthenticationServiceUtil;
import org.springframework.stereotype.Service;

@Service
public class ExpenseService {
    private final ExpenseRepo expenseRepo;
    private final AuthenticationServiceUtil authUtil;
    private final CurrencyRepo currencyRepo;
    private final UserRepo userRepo;
    private final CategoryRepo categoryRepo;

    public ExpenseService(ExpenseRepo expenseRepo, AuthenticationServiceUtil authUtil, CurrencyRepo currencyRepo, UserRepo userRepo, CategoryRepo categoryRepo) {
        this.expenseRepo = expenseRepo;
        this.authUtil = authUtil;
        this.currencyRepo = currencyRepo;
        this.userRepo = userRepo;
        this.categoryRepo = categoryRepo;
    }

    public Iterable<Expense> getAllExpenses(){
        String userId = authUtil.getCurrentUserUuid();
        return expenseRepo.findAllExpensesByUserId(userId);
    }

    public Expense getExpenseById(Long id){
        String userId = authUtil.getCurrentUserUuid();
        return expenseRepo.findByExpenseIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id + " for user: " + userId));
    }

    public Expense saveExpense(SaveExpenseDto expenseDto) {
        String userId = authUtil.getCurrentUserUuid();
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with UUID: " + userId));

        Currency currency = currencyRepo.findCurrencyByIdAndUserId(expenseDto.currencyId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Currency not found with id: " + expenseDto.currencyId() + " for user: " + userId));

        Category category = categoryRepo.findCategoryByIdAndUserId(expenseDto.categoryId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + expenseDto.categoryId() + " for user: " + userId));

        Expense newExpense = new Expense(user,currency,category,expenseDto.amount(),expenseDto.description(),expenseDto.date());

        return expenseRepo.save(newExpense);
    }

    public Expense updateExpense(UpdateExpenseDto updateExpenseDto) {
        String userId = authUtil.getCurrentUserUuid();

        Currency currency = currencyRepo.findCurrencyByIdAndUserId(updateExpenseDto.currencyId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Currency not found with id: " + updateExpenseDto.currencyId() + " for user: " + userId));

        Category category = categoryRepo.findCategoryByIdAndUserId(updateExpenseDto.categoryId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + updateExpenseDto.categoryId() + " for user: " + userId));

        Expense oldExpense = expenseRepo.findByExpenseIdAndUserId(updateExpenseDto.id(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found with id: " + updateExpenseDto.id() + " for user: " + userId));

        oldExpense.setAmount(updateExpenseDto.amount());
        oldExpense.setCurrency(currency);
        oldExpense.setCategory(category);
        oldExpense.setDescription(updateExpenseDto.description());
        oldExpense.setDate(updateExpenseDto.date());

        return expenseRepo.save(oldExpense);
    }

    public void deleteIncome(Long id) {
        String userId = authUtil.getCurrentUserUuid();
        expenseRepo.deleteExpenseByIdAndUserId(id, userId);
    }

}
