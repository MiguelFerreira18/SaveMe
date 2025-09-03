package com.money.SaveMe.Service;


import com.money.SaveMe.DTO.Wish.SaveWishDto;
import com.money.SaveMe.DTO.Wish.UpdateWishDto;
import com.money.SaveMe.Model.Currency;
import com.money.SaveMe.Model.User;
import com.money.SaveMe.Model.Wish;
import com.money.SaveMe.Repo.CurrencyRepo;
import com.money.SaveMe.Repo.UserRepo;
import com.money.SaveMe.Repo.WishRepo;
import com.money.SaveMe.Utils.AuthenticationServiceUtil;
import org.springframework.stereotype.Service;

@Service
public class WishService {
    private final WishRepo wishRepo;
    private final UserRepo userRepo;
    private final CurrencyRepo currencyRepo;
    private final AuthenticationServiceUtil authUtil;

    public WishService(WishRepo wishRepo, UserRepo userRepo, CurrencyRepo currencyRepo, AuthenticationServiceUtil authUtil) {
        this.wishRepo = wishRepo;
        this.userRepo = userRepo;
        this.currencyRepo = currencyRepo;
        this.authUtil = authUtil;
    }

    public Iterable<Wish> getAllWishes(){
        String userId = authUtil.getCurrentUserUuid();
        return wishRepo.findAllByUserId(userId);
    }

    public Wish getWishById(Long currencyId){
        String userId = authUtil.getCurrentUserUuid();
        return wishRepo.findByUserIdAndCurrencyId(userId,currencyId)
                .orElseThrow(() -> new RuntimeException("Wish not found with currency id: " + currencyId + " for user: " + userId));
    }

    public Wish saveWish(SaveWishDto wishDto){
        String userId = authUtil.getCurrentUserUuid();
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with UUID: " + userId));
        Currency currency = currencyRepo.findCurrencyByIdAndUserId(wishDto.currencyId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Currency not found with id: " + wishDto.currencyId() + " for user: " + userId));

        Wish newWish = new Wish(user,currency,wishDto.amount(),wishDto.description(),wishDto.date());
        return wishRepo.save(newWish);
    }

    public Wish updateWish(UpdateWishDto updateWishDto){
        String userId = authUtil.getCurrentUserUuid();
        Wish existingWish = wishRepo.findByIdAndUserId(updateWishDto.id(),userId)
                .orElseThrow(() -> new RuntimeException("Wish not found with id: " + updateWishDto.id() + " for user: " + userId));

        Currency currency = currencyRepo.findCurrencyByIdAndUserId(updateWishDto.currencyId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Currency not found with id: " + updateWishDto.currencyId() + " for user: " + userId));

        existingWish.setCurrency(currency);
        existingWish.setAmount(updateWishDto.amount());
        existingWish.setDescription(updateWishDto.description());
        existingWish.setDate(updateWishDto.date());

        return wishRepo.save(existingWish);
    }

    public void deleteWishById(Long id){
        String userId = authUtil.getCurrentUserUuid();
        wishRepo.deleteByIdAndUserId(id,userId);
    }

}
