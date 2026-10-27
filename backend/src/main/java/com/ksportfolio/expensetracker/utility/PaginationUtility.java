package com.ksportfolio.expensetracker.utility;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import lombok.experimental.UtilityClass;
import org.springframework.data.domain.Pageable;

import java.util.Set;

@UtilityClass
public final class PaginationUtility {
    public static void validateSort(Pageable pageable, Set<String> sortFields ) {
        pageable.getSort().forEach(o -> {
            if(!sortFields.contains(o.getProperty())){
                throw new BusinessLogicException(ErrorCode.INVALID_SORT_FIELD,o.getProperty());
            }
        });
    }
}
