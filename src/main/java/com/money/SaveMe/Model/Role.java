package com.money.SaveMe.Model;

import jakarta.persistence.Embeddable;
import lombok.Value;
import org.springframework.security.core.GrantedAuthority;


@Value
@Embeddable
public class Role implements GrantedAuthority {

    public static final String ADMIN = "Admin";
    public static final String  INSTITUTION= "Institution";
    public static final String USER = "User";
    String authority;


    public Role(String authority) {
        this.authority = authority;
    }

    public Role() {
        this.authority = USER;
    }

    @Override
    public String getAuthority() {
        return authority;
    }
}
