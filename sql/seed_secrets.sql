USE weather_app;

-- Replace placeholders with your real tokens/keys locally (do NOT commit secrets).
INSERT INTO secrets (provider, key_name, key_value) VALUES
('mapbox','access_token','REPLACE_WITH_YOUR_MAPBOX_TOKEN'),
('openweathermap','api_key','REPLACE_WITH_YOUR_OWM_KEY');
