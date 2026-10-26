package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.dto.response.ApiPage;
import lombok.experimental.UtilityClass;
import org.springframework.data.domain.Page;

@UtilityClass
public final class PageMapper {
    public static <T> ApiPage<T> toDto(Page<T> page) {
        ApiPage<T> apiPage = new ApiPage<>();
        apiPage.setPage(page.getNumber());
        apiPage.setSize(page.getSize());
        apiPage.setTotalPage(page.getTotalPages());
        apiPage.setTotalElement(page.getTotalElements());
        apiPage.setContent(page.getContent());
        return apiPage;
    }
}
