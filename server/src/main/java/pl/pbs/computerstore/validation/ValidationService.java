package pl.pbs.computerstore.validation;

import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ValidationService<T> {
    private final Validator validator;
    @Autowired
    public ValidationService(Validator validator) {
        this.validator = validator;
    }

    public void validate(T object) {
        var violations = validator.validate(object);
        if (!violations.isEmpty())
            throw new ConstraintViolationException(violations);
    }
}
