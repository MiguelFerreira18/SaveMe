package com.money.SaveMe.Model;

import lombok.*;

import java.util.List;
import java.util.Set;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserView {
    String id;
    String name;
    List<String> authorities;
}
