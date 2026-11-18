package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.type.Gender;
import jakarta.persistence.AttributeConverter;

public class GenderConverter implements AttributeConverter<Gender, Character> {
    @Override
    public Character convertToDatabaseColumn(Gender gender) {
        if (gender == null) {
            return null;
        }
        return switch (gender) {
            case MALE -> 'M';
            case FEMALE -> 'F';
            case OTHER -> 'O';
            default -> null;
        };
    }

    @Override
    public Gender convertToEntityAttribute(Character character) {
        if (character == null) {
            return null;
        }
        return switch (character){
            case 'M' -> Gender.MALE;
            case 'F' -> Gender.FEMALE;
            case 'O' -> Gender.OTHER;
            default -> null;
        };
    }
}
