package com.ksportfolio.expensetracker.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ApiPage<T> {
    private List<T> content;
    private Integer page;
    private Integer size;
    private Integer totalPage;
    private Long totalElement;
}
