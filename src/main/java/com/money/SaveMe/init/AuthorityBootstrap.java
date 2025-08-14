package com.money.SaveMe.init;

import com.money.SaveMe.Model.Authority;
import com.money.SaveMe.Service.AuthorityService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AuthorityBootstrap implements CommandLineRunner {
    private final AuthorityService authorityService;

    public AuthorityBootstrap(AuthorityService authorityService) {
        this.authorityService = authorityService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!authorityService.authorityExists(Authority.Role.USER)) {
            authorityService.saveAuthority(new Authority(Authority.Role.USER));
        }
        if (!authorityService.authorityExists(Authority.Role.ADMIN)) {
            authorityService.saveAuthority(new Authority(Authority.Role.ADMIN));
        }
    }
}
