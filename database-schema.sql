-- Run once in your managed MySQL database before deploying.
CREATE TABLE IF NOT EXISTS site_settings (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  settings_json JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO site_settings (id, settings_json)
VALUES (1, JSON_OBJECT(
  'churchName', 'La Gloire de Dieu',
  'address', '', 'cityCountry', '', 'phone', '', 'prayerLine', '', 'email', ''
)) ON DUPLICATE KEY UPDATE id = id;

CREATE TABLE IF NOT EXISTS site_records (
  collection_name VARCHAR(32) NOT NULL,
  record_id VARCHAR(80) NOT NULL,
  payload JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (collection_name, record_id),
  KEY idx_collection_created (collection_name, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
