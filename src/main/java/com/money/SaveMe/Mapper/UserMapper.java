package com.money.SaveMe.Mapper;

import com.money.SaveMe.Authentication.SignUpRequest;
import com.money.SaveMe.Model.Role;
import com.money.SaveMe.Model.User;
import com.money.SaveMe.Model.UserView;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;

@Component
public class UserMapper {
    public UserView toUserView(User user) {
        if (user == null) {
            return null;
        }

        String id = user.getId();
        String name = user.getName();
        Set<Role> authorities = grantedAuthorityCollectionToRoleSet(user.getAuthorities());

        return new UserView(id, name, authorities);
    }

    public User toUser(SignUpRequest signUpRequest) {
        if (signUpRequest == null) {
            return null;
        }

        User user = new User();

        user.setEmail(signUpRequest.getEmail());
        user.setName(signUpRequest.getName());
        user.setPassword(signUpRequest.getPassword());


        return user;
    }

    protected Role grantedAuthorityToRole(GrantedAuthority grantedAuthority) {
        if (grantedAuthority == null) {
            return null;
        }

        String authority = grantedAuthority.getAuthority();
        return new Role(authority);
    }

    protected Set<Role> grantedAuthorityCollectionToRoleSet(Collection<? extends GrantedAuthority> collection) {
        if (collection == null) {
            return null;
        }

        Set<Role> set = new LinkedHashSet<>(Math.max((int) (collection.size() / .75f) + 1, 16));
        for (GrantedAuthority grantedAuthority : collection) {
            set.add(grantedAuthorityToRole(grantedAuthority));
        }

        return set;
    }
}
