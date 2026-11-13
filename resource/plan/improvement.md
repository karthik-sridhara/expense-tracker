1.add skip field in payments
2.encrypt the amount field in all tables
3.fetch FAQ from DB and find way to update the FAQ
4.Inconsistent naming. Most columns use snake_case, but isUniversal, isActive, endDate and lastGeneratedDate use camelCase. 
Table names are also inconsistent (ROLE and CATEGORY versus the APP_ prefix). RECURRING_PAYMENT and BUDGET also use type for the period, 
while CATEGORY.type means something else.