const db = require("../config/db");

exports.createSale = (req, res) => {
  const { total_amount, items } = req.body;

  if (!total_amount || !items || items.length === 0) {
    return res.status(400).json({ msg: "No sale items provided" });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({ msg: "Transaction failed" });
    }

    //  Insert into sales table
    db.query(
      "INSERT INTO sales (total_amount) VALUES (?)",
      [total_amount],
      (err, saleResult) => {
        if (err) {
          return db.rollback(() => {
            console.error("Sales insert error:", err);
            res.status(500).json({ msg: "Sale creation failed" });
          });
        }

        const saleId = saleResult.insertId;

        const invoiceNo = `INV-${new Date().getFullYear()}-${String(saleId).padStart(4, "0")}`;

        db.query(
          "UPDATE sales SET invoice_no = ? WHERE id = ?",
          [invoiceNo, saleId],
          (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Invoice no update failed", err);
                res.status(500).json({ msg: "Invoice creation failed" });
              });
            }
          },
        );

        // Insert sale items + update stock
        let completed = 0;

        items.forEach((item) => {
          // insert sales_items
          db.query(
            "INSERT INTO sales_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
            [saleId, item.product_id, item.quantity, item.price],
            (err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Sales item error:", err);
                  res.status(500).json({ msg: "Sale item failed" });
                });
              }

              // update stock
              db.query(
                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                [item.quantity, item.product_id],
                (err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error("Stock update error:", err);
                      res.status(500).json({ msg: "Stock update failed" });
                    });
                  }

                  completed++;

                  // commit only after all items processed
                  if (completed === items.length) {
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          console.error("Commit error:", err);
                          res.status(500).json({ msg: "Commit failed" });
                        });
                      }

                      res.status(201).json({
                        msg: "Sale completed successfully",
                        sale_id: saleId,
                      });
                    });
                  }
                },
              );
            },
          );
        });
      },
    );
  });
};

exports.getAllSales = (req, res) => {
  const sql = `
    SELECT 
      s.id,
      s.invoice_no,
      s.total_amount,
      s.created_at,
      c.name AS customer_name
    FROM sales s
    LEFT JOIN customers c ON s.customer_id = c.id
    ORDER BY s.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Sales fetch error:", err);
      return res.status(500).json({ msg: "Failed to fetch sales" });
    }

    res.json(results);
  });
};
