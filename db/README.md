# Database Schema

## Table: `stocks`
| Field          | Type               | Null | Key | Default | Extra          |
|----------------|--------------------|------|-----|---------|----------------|
| id             | int                | NO   | PRI | NULL    | auto_increment |
| symbol         | varchar(10)        | NO   | MUL | NULL    |                |
| purchase_price | decimal(10,2)      | NO   |     | NULL    |                |
| action         | enum('buy','sell') | NO   |     | NULL    |                |
| quantity       | int                | NO   |     | 1       |                |

## Table: `portfolio_master`
| Field  | Type         | Null | Key | Default | Extra |
|--------|--------------|------|-----|---------|-------|
| symbol | varchar(10)  | NO   | PRI | NULL    |       |
| name   | varchar(100) | YES  |     | NULL    |       |

## Table: `current_prices`
| Field         | Type          | Null | Key | Default | Extra |
|---------------|---------------|------|-----|---------|-------|
| symbol        | varchar(10)   | NO   | PRI | NULL    |       |
| current_price | decimal(10,2) | YES  |     | NULL    |       |
| last_updated  | datetime      | YES  |     | NULL    |       |