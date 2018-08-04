-- SELECT departProd.department_id, departProd.department_name, departProd.over_head_costs, 
-- SUM(departProd.product_sales) as product_sales, 
-- (SUM(departProd.product_sales) - departProd.over_head_costs) as total_profit 
-- FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.item_sales, 0) as product_sales 
-- FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as departProd GROUP BY department_id;


SELECT departProd.department_id, departProd.department_name, departProd.over_head_costs, SUM(departProd.product_sales) as product_sales, (SUM(departProd.product_sales) - departProd.over_head_costs) as total_profit
FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.item_sales, 0) as product_sales 
FROM products 
RIGHT JOIN departments ON products.department_name = departments.department_name) as departProd
WHERE department_name = "Electronics"
GROUP BY department_id;
