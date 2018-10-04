INSERT INTO fin_interval_types(interval_type_id, name) VALUES
  (0, "DAY"),
  (1, "WEEK"),
  (2, "MONTHLY"),
  (3, "YEARLY");

INSERT INTO fin_accounts_categories(category_id, name, active) VALUES
  (1, "Active real accounts", 1),
  (2, "Passive real accounts", 0),
  (3, "Expense accounts", 1),
  (4, "Income accounts", 0);

INSERT INTO fin_accounts(account_id, name, note, parent_account, category_id) VALUES
  (1200, "Forderungen aus Lieferungen und Leistungen", NULL, NULL, 1),
  (1600, "Kasse", NULL, NULL, 1),
  (1800, "Bank", NULL, NULL, 1),
  (1801, "Girokonto BW-Bank", NULL, 1800, 1),
  (1801, "Girokonto KSK Esslingen-Nürtingen", NULL, 1800, 1),
  (6100, "Löhne & Gehälter", NULL, NULL, 4),
  (6101, "Gehalt Tutorium HFT", NULL, 6100, 4);

INSERT INTO fin_transactions(account, contra_account, amount, note) VALUES
  (1801, 6101, 290, "Gehalt April");