@echo off
echo Testing database...
set PGPASSWORD=personalfinance_pass
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U personalfinance_user -h localhost -d personalfinance_db -c "SELECT 1;"
echo Done.
