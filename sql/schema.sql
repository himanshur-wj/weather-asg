CREATE DATABASE IF NOT EXISTS weather_app
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE weather_app;

-- Store API keys in DB (required by test)
CREATE TABLE IF NOT EXISTS secrets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(64) NOT NULL,         -- 'mapbox' | 'openweathermap' | etc
  key_name VARCHAR(128) NOT NULL,        -- 'access_token' | 'api_key'
  key_value TEXT NOT NULL,               -- the credential value
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(provider),
  INDEX(provider_key) (provider, key_name)
);

-- Store request + result
CREATE TABLE IF NOT EXISTS weather_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  address VARCHAR(255),
  lat DECIMAL(9,6),
  lon DECIMAL(9,6),
  method VARCHAR(32) DEFAULT 'fetch',    -- 'fetch' | 'form' or similar
  result_json JSON,                      -- requires MySQL 5.7+; if older, switch to LONGTEXT
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
