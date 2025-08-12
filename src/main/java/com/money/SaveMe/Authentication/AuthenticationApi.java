package com.money.SaveMe.Authentication;

import com.money.SaveMe.Mapper.UserMapper;
import com.money.SaveMe.Model.User;
import com.money.SaveMe.Model.UserView;
import com.money.SaveMe.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;

@RestController
@RequestMapping("auth/public")
public class AuthenticationApi {
    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder;

    private final JwtEncoder jwtEncoder;

    private final UserService userService;

    private final UserMapper userMapper;

    public AuthenticationApi(AuthenticationManager authenticationManager, JwtEncoder jwtEncoder, UserService userService, UserMapper userMapper,
                             PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.userService = userService;
        this.userMapper = userMapper;

    }

    private static final String ISSUER = "example.com";

    private static final long EXPIRATION_TIME = 36000L;


    @PostMapping("login")
    public ResponseEntity<UserView> login(@RequestBody @Valid final SignInRequest request) {

        try {
            Authentication authentication = authenticate(request);
            final User principal = (User) authentication.getPrincipal();

            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            return buildAuthenticationResponse(authentication, principal);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    private Authentication authenticate(SignInRequest request) {
        return authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.email, request.password));
    }

    private ResponseEntity<UserView> buildAuthenticationResponse(Authentication authentication, User principal) {
        String scope = extractScope(authentication);
        JwtClaimsSet claims = buildClaims(principal, scope);
        String token = generateToken(claims);

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, token)
                .body(userMapper.toUserView(principal));

    }

    private String extractScope(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(joining(" "));
    }

    private JwtClaimsSet buildClaims(User principal, String scope) {
        Instant now = Instant.now();
        JwtClaimsSet.Builder baseClaimsBuilder = JwtClaimsSet.builder()
                .issuer(ISSUER)
                .issuedAt(now)
                .expiresAt(now.plusSeconds(EXPIRATION_TIME))
                .claim("role", scope);

        return baseClaimsBuilder
                .subject(format("User,%s,%s", principal.getId(), principal.getName()))
                .claim("type", "User")
                .claim("uuid", principal.getId())
                .claim("email", principal.getEmail())
                .build();

    }

    private String generateToken(JwtClaimsSet claims) {
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    @PostMapping("signup")
    public ResponseEntity<UserView> signup(@RequestBody @Valid final SignUpRequest request) {
        if (request.password == null || !request.password.equals(request.repeatPassword)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            User newUser = userMapper.toUser(request);
            newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
            return userService.saveUser(newUser)
                    .map(savedUser -> {
                        return ResponseEntity.status(HttpStatus.CREATED)
                                .body(userMapper.toUserView(savedUser));
                    })
                    .orElseGet(() -> {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    });


        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
