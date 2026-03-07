const db = require("../config/db");

exports.getInvoiceBySaleId = (req, res) => {
  const { saleId } = req.params;

  // Fetch invoice (sale)
  const invoiceQuery = `
    SELECT 
      id,
      invoice_no,
      total_amount,
      created_at
    FROM sales
    WHERE id = ?
  `;

  db.query(
    `SELECT 
    s.id,
    s.invoice_no,
    s.total_amount,
    s.created_at,
    c.name AS customer_name
   FROM sales s
   LEFT JOIN customers c ON s.customer_id = c.id
   WHERE s.id = ?`,
    [saleId],
  );

  db.query(invoiceQuery, [saleId], (err, invoiceResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Invoice fetch failed" });
    }

    if (invoiceResult.length === 0) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    //  Fetch invoice items WITH PRODUCT DETAILS (JOIN)
    const itemsQuery = `
      SELECT
        p.name AS product_name,
        p.hsn_code,
        si.quantity,
        si.price,
        (si.quantity * si.price) AS total
      FROM sales_items si
      JOIN products p ON p.id = si.product_id
      WHERE si.sale_id = ?
    `;

    db.query(itemsQuery, [saleId], (err, itemsResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Invoice items fetch failed" });
      }

      res.json({
        invoice: invoiceResult[0],
        items: itemsResult,
      });
    });
  });
};
