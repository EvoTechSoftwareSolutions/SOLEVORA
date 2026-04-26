import mysql from 'mysql2/promise';

async function fix() {
  const conn = await mysql.createConnection('mysql://root:@localhost:3306/solevora_db');
  await conn.execute('UPDATE orders o LEFT JOIN users u ON o.userId = u.id SET o.userId = NULL WHERE u.id IS NULL AND o.userId IS NOT NULL');
  await conn.execute('DELETE a FROM addresses a LEFT JOIN users u ON a.userId = u.id WHERE u.id IS NULL');
  await conn.execute('DELETE r FROM reviews r LEFT JOIN users u ON r.userId = u.id WHERE u.id IS NULL');
  await conn.execute('DELETE w FROM wishlists w LEFT JOIN users u ON w.userId = u.id WHERE u.id IS NULL');
  await conn.execute('DELETE r FROM reviews r LEFT JOIN products p ON r.productId = p.id WHERE p.id IS NULL');
  await conn.execute('DELETE w FROM wishlists w LEFT JOIN products p ON w.productId = p.id WHERE p.id IS NULL');
  await conn.execute('DELETE pb FROM product_batches pb LEFT JOIN products p ON pb.productId = p.id WHERE p.id IS NULL');
  await conn.execute('DELETE oi FROM order_items oi LEFT JOIN products p ON oi.productId = p.id WHERE p.id IS NULL');
  await conn.execute('DELETE oi FROM order_items oi LEFT JOIN orders o ON oi.orderId = o.id WHERE o.id IS NULL');
  await conn.execute('UPDATE products p LEFT JOIN categories c ON p.categoryId = c.id SET p.categoryId = NULL WHERE c.id IS NULL AND p.categoryId IS NOT NULL');
  console.log('Fixed orphaned records');
  process.exit(0);
}

fix();
