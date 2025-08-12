package com.money.SaveMe.Service;

import com.money.SaveMe.Model.Role;
import com.money.SaveMe.Model.User;
import com.money.SaveMe.Model.UserView;
import com.money.SaveMe.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService implements UserDetailsService {


    private final UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public Optional<User> saveUser(User user) {

        Optional<User> userOptional;
        try {
            user.setPassword(user.getPassword());
            user.addAuthority(new Role(Role.USER));
            userOptional = Optional.of(userRepo.save(user));
        } catch (Exception e) {
            return Optional.empty();
        }
        return userOptional;
    }



    @Transactional
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> user = userRepo.findByEmail(email);
        if (user.isPresent()) {
            return user.get();
        }
        throw new UsernameNotFoundException("User not found with email: " + email);
    }



    public UserView toUserView(User user) {
        if (user == null) {
            return null;
        }

        String id = user.getId();
        String name = user.getName();
        Set<Role> authorities = null;

        return new UserView(id, name, authorities);

    }
}
