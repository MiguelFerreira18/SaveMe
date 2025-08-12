package com.money.SaveMe.Model;

import lombok.Data;

import java.util.Set;

@Data
public class UserView {
    String id;
    String name;
    Set<Role> authorities;

    public UserView(String id, String name, Set<Role> authorities) {
        this.id = id;
        this.name = name;
        this.authorities = authorities;
    }

}
