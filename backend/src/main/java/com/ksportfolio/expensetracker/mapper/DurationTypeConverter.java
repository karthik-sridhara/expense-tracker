package com.ksportfolio.expensetracker.mapper;


import com.ksportfolio.expensetracker.type.DurationType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class DurationTypeConverter implements AttributeConverter<DurationType, Character> {

    @Override
    public Character convertToDatabaseColumn(DurationType type) {
        if (type == null) {
            return null;
        }
        return switch (type) {
            case DAILY -> 'D';
            case WEEKLY -> 'W';
            case MONTHLY -> 'M';
            case YEARLY -> 'Y';
        };
    }

    @Override
    public DurationType convertToEntityAttribute(Character dbChar) {
        if (dbChar == null) {
            return null;
        }
        return switch (dbChar) {
            case 'D' -> DurationType.DAILY;
            case 'W' -> DurationType.WEEKLY;
            case 'M' -> DurationType.MONTHLY;
            case 'Y' -> DurationType.YEARLY;
            default -> throw new IllegalArgumentException("Unknown budget type char: " + dbChar);
        };
    }
}
