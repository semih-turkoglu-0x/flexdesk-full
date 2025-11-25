package dev.flexdesk.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import dev.flexdesk.authentication.models.NewCredentials;
import dev.flexdesk.authentication.models.UnsafeCredentials;
import dev.flexdesk.model.User;
import dev.flexdesk.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository repository;
    private final Algorithm jwtAlgorithm;
    private final JWTVerifier jwtVerifier;

    public AuthenticationService(UserRepository repository, AuthenticationProperties properties) {
        this.repository = repository;
        this.jwtAlgorithm = Algorithm.HMAC512(properties.getSecret());
        this.jwtVerifier = JWT.require(this.jwtAlgorithm).withIssuer("auth0").build();
    }

    public String connect(UnsafeCredentials unsafeCredentials) {
        User user = repository.findByUsername(unsafeCredentials.getEmail());
        if (user == null) return null;
        if (!checkPassword(unsafeCredentials.getPassword(), user.getPassword())) return null;
        return createToken(user.getUsername());
    }

    public String verify(String token) {
        try {
            String email = jwtVerifier.verify(token).getClaim("email").asString();
            if (!repository.existsByUsername(email)) return null;
            return email;
        } catch (JWTVerificationException e) {
            return null;
        }
    }

    public boolean createOne(UnsafeCredentials unsafeCredentials) {
        if (repository.existsByUsername(unsafeCredentials.getEmail())) return false;
        repository.save(
            unsafeCredentials.makeSafe(hashPassword(unsafeCredentials.getPassword())));
        return true;
    }

    public boolean changePassword(NewCredentials credentials) {
        User user = repository.findByUsername(credentials.getEmail());
        if (user == null) return false;
        if (!checkPassword(credentials.getOldPassword(), user.getPassword())) return false;
        user.setPassword(hashPassword(credentials.getNewPassword()));
        repository.save(user);
        return true;
    }

    public boolean deleteOne(String email) {
        User user = repository.findByUsername(email);
        if (user == null) return false;
        repository.delete(user);
        return true;
    }

    private boolean checkPassword(String clearPassword, String hashedPassword) {
        try {
            return BCrypt.checkpw(clearPassword, hashedPassword);
        } catch (IllegalArgumentException e) {
            return clearPassword.equals(hashedPassword);
        }
    }

    private String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    private String createToken(String email) {
        return JWT.create()
            .withIssuer("auth0")
            .withClaim("email", email)
            .sign(jwtAlgorithm);
    }
}
