# 🚀 Quick Start: PostgreSQL Database Setup

## Option A: Automatic Setup (Recommended)

### 1. Setup PostgreSQL Database
```bash
setup-postgresql.bat
```
- Downloads PostgreSQL if needed
- Creates database and user
- Configures everything automatically

### 2. Start Services with Database
```bash
start-with-database.bat
```
- Builds all Spring Boot services
- Starts with PostgreSQL (production mode)
- All data will be persistent

### 3. Test Everything
```bash
test-database.bat
```
- Verifies all services are running
- Tests database connection
- Creates test user to verify integration

### 4. Start Frontend
```bash
cd frontend
npm start
```
- Visit: http://localhost:3000
- All data now persists in PostgreSQL!

---

## Option B: Manual Setup

### 1. Install PostgreSQL
- Download: https://www.postgresql.org/download/windows/
- Remember the postgres password
- Add to PATH during installation

### 2. Run Database Script
```bash
psql -U postgres -f database-setup.sql
```

### 3. Start Services
```bash
mvn clean install
cd user-service && mvn spring-boot:run -Dspring.profiles.active=prod
cd transaction-service && mvn spring-boot:run -Dspring.profiles.active=prod
cd budget-service && mvn spring-boot:run -Dspring.profiles.active=prod
cd api-gateway && mvn spring-boot:run -Dspring.profiles.active=prod
```

---

## 🔧 Development vs Production

### Development Mode (H2 Database)
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```
- Quick startup
- In-memory database
- Data lost on restart

### Production Mode (PostgreSQL)
```bash
mvn spring-boot:run -Dspring.profiles.active=prod
```
- Persistent data
- Multi-device access
- Better performance

---

## 🏆 Benefits You'll Get

✅ **Persistent Data**: No more data loss when clearing browser
✅ **Multi-Device Access**: Login from any computer
✅ **Better Security**: Database-level authentication
✅ **Professional Setup**: Industry-standard architecture
✅ **Backup & Recovery**: Easy database backups
✅ **Scalability**: Ready for multiple users

---

## 🆘 Troubleshooting

### PostgreSQL Won't Install
- Run as Administrator
- Disable antivirus temporarily
- Check Windows version compatibility

### Services Won't Start
- Check if ports 8080-8083 are free
- Verify PostgreSQL is running (services.msc)
- Check firewall settings

### Database Connection Failed
- Verify PostgreSQL service is running
- Check password: personalfinance_pass
- Try: `psql -U personalfinance_user -d personalfinance_db`

### Frontend Issues
- Restart frontend: Ctrl+C, then `npm start`
- Clear browser cache
- Check console for errors

---

**Ready to start? Run: `setup-postgresql.bat` 🎉**
