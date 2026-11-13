I understood most of the names from the table names and columns alone, but a few are ambiguous enough that I'd rename them. A new developer would have to read the code to resolve them.

## Clear as they are
`ROLE`, `APP_USER`, `USER_PROFILE`, `CATEGORY`, `BUDGET`, `RECURRING_PAYMENT`.

## Confusing
| Current | Problem | Suggestion |
|---|---|---|
| `APP_TRANSACTION` vs `PAYMENT` | I had to infer the difference from the foreign keys. A `PAYMENT` looks like a scheduled or due item, and a `TRANSACTION` looks like money that actually moved. Both names sound like the same thing. | `APP_TRANSACTION` → `TRANSACTION` (it's only prefixed because `TRANSACTION` is a reserved word, so `EXPENSE_TRANSACTION` also works). `PAYMENT` → `SCHEDULED_PAYMENT` or `PAYMENT_DUE`. |
| `RECURRING_PAYMENT` → `PAYMENT` | The template and the instance both say "payment". | Keep `RECURRING_PAYMENT` and rename `PAYMENT` as above, so the pair reads as template and instance. |
| `CATEGORY.type` (BIT) | Income or expense? Nothing in the name says. | `CHAR(1)` with `'I'` and `'E'`, named `category_type`. |
| `RECURRING_PAYMENT.recurring` and `BUDGET.type` | Both hold the period (`D`, `W`, `M`, `Y`). The two columns share one meaning, but neither name says it, and `type` means something different on `CATEGORY`. | Rename both to `frequency` (recurring payment) and `period` (budget). |
| `RECURRING_PAYMENT.day` / `month` | `day` of what? It could be the weekday, day of month, or day of year. | `day_of_month` and `month_of_year`. |
| `limit_amount` vs `amount` | Fine, but `amount` appears everywhere. | Keep these. |
| `CATEGORY.isUniversal` | It means a shared category visible to all users. | `is_global` or `is_system` is clearer. |

## Inconsistent style
Columns mix snake_case (`created_at`, `user_id`) with camelCase (`isActive`, `isUniversal`, `endDate`, `lastGeneratedDate`). Pick one. I recommend snake_case, because most of your columns already use it: `is_active`, `is_universal`, `end_date`, `last_generated_date`. Also, `APP_USER.role` is a foreign key but doesn't say so, so `role_id` would match `category_id` and `user_id` elsewhere.

## My recommendation
Do the renames that remove ambiguity: `PAYMENT` → `SCHEDULED_PAYMENT`, `category.type` → `category_type`, `recurring`/`type` → `frequency`/`period`, and `day`/`month` → `day_of_month`/`month_of_year`. Standardize on snake_case at the same time.

Renaming is cheap now, before the schema has data and before the backend and frontend hard-code more names. It gets costly later.

I can write the full renamed schema in chat, or a mapping of old name to new name. Tell me which, and whether to keep `APP_TRANSACTION` as is.