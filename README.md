# Weather Tech Test (Node.js + Express + MySQL)

**What it does**  
- Enter an **address** ➜ uses **Mapbox** to geocode to **lat/lon**  
- Calls **OpenWeather** for **Current** and **Hourly** forecasts (One Call 3.0 with fallback to 5-day/3-hour)  
- **Save** request + results to **MySQL** (with API keys stored in DB, not in code)  
- **List history** from DB  
- Minimal UI with **Nunjucks + jQuery + Bootstrap**, dynamically adds result cards  
- Bonus: shows **AJAX (fetch via jQuery)** **and** **plain HTML Form POST**

## Stack
- NodeJS, ExpressJS
- Nunjucks
- jQuery (no frontend framework)
- MySQL (using `mysql2/promise`)
- Axios for HTTP

## Quickstart

### 1) Install
```bash
npm i
cp .env.example .env
# Fill DB credentials in .env
```

### 2) MySQL schema & seed
```bash
mysql -u root -p < sql/schema.sql
# Edit sql/seed_secrets.sql to replace placeholders, then:
mysql -u root -p < sql/seed_secrets.sql
```

> **Do not commit real API keys**. Per the test, keys are stored in the `secrets` table.

### 3) Run
```bash
npm run dev
# http://localhost:3000
```

### 4) DB backup (commit allowed by spec)
```bash
mysqldump -u root -p weather_app > sql/backup_$(date +%Y%m%d).sql
git add sql/backup_*.sql
git commit -m "DB backup"
```

## Postman
Import both files in `/postman/`:
- **WeatherLocal.postman_environment.json**
- **WeatherTechTest.postman_collection.json**

Set Environment to **Weather Local** and run requests in order.

## Notes
- **Keys in DB**:  
  - Mapbox ➜ `provider='mapbox', key_name='access_token'`  
  - OpenWeather ➜ `provider='openweathermap', key_name='api_key'`
- **Hourly**: Tries One Call 3.0 (`/data/3.0/onecall`). If not available on your plan, falls back to `5 day / 3 hour` (`/data/2.5/forecast`) and returns `provider: "forecast3h"`.
- **MySQL JSON** column requires MySQL 5.7+ / MariaDB with JSON support. If on older DB, change `result_json JSON` to `LONGTEXT` and JSON.stringify/parse in app code.

## Repo hygiene
- This is a Node project, so **package.json** is the canonical dependency list. A `requirements.txt` is included just to satisfy the spec text; it points to package.json.
- `.gitignore` excludes `node_modules` and `.env`.

## Scripts
- `npm run dev` – start with nodemon
- `npm start` – start without nodemon
