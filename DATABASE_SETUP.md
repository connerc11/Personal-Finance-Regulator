# Personal Finance Regulator - Database Setup Guide

## 🗄️ **PostgreSQL Database Implementation**

Your Personal Finance Regulator now supports PostgreSQL database for secure, persistent data storage!

### 🚀 **Quick Start**

1. **Install PostgreSQL** (if not already installed):
   - Download from: https://www.postgresql.org/download/windows/
   - During installation, remember the postgres user password

2. **Setup Database**:
   ```bash
   # Run the automated setup script
   setup-database.bat
   ```

3. **Start Services** (with PostgreSQL):
   ```bash
   # Start all services with production profile
   mvn spring-boot:run -Dspring.profiles.active=prod
   ```

4. **Migrate Existing Data** (optional):
   ```bash
   # Run migration helper
   .\migrate-data.ps1
   ```

### 🔧 **Configuration Options**

#### Development Mode (H2 Database)
- Fast startup for development
- In-memory database (data lost on restart)
- H2 console available at: http://localhost:8081/h2-console

```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

#### Production Mode (PostgreSQL)
- Persistent data storage
- Better performance and security
- Multi-user support

```bash
mvn spring-boot:run -Dspring.profiles.active=prod
```

### 📊 **Database Schema**

The following tables will be automatically created:

- **users** - User accounts and authentication
- **transactions** - Financial transactions
- **budgets** - Budget tracking
- **financial_goals** - Savings goals and targets

### 🔐 **Database Connection Details**

- **Host**: localhost
- **Port**: 5432
- **Database**: personalfinance_db
- **Username**: personalfinance_user
- **Password**: personalfinance_pass

### 🛠️ **Troubleshooting**

#### PostgreSQL Connection Issues
1. Ensure PostgreSQL service is running
2. Check firewall settings
3. Verify database credentials in application.yml

#### Service Startup Issues
1. Check if ports 8081-8083 are available
2. Verify PostgreSQL is accessible
3. Check logs for detailed error messages

#### Data Migration Issues
1. Export localStorage data first (see migrate-data.ps1)
2. Ensure all services are running
3. Check browser console for errors

### 📈 **Benefits of PostgreSQL Implementation**

✅ **Data Persistence**: Your data survives browser restarts and clearing
✅ **Multi-device Access**: Access your data from any device
✅ **Data Security**: Proper authentication and data encryption
✅ **Performance**: Better performance with large datasets
✅ **Backup**: Easy database backups and recovery
✅ **Scalability**: Ready for multiple users and advanced features

### 🔄 **Development Workflow**

1. **Development**: Use H2 profile for quick testing
2. **Testing**: Switch to PostgreSQL for integration testing
3. **Production**: Deploy with PostgreSQL for real usage

### 📝 **Next Steps**

After successful database setup, you can:

1. **Create new user accounts** - Data will be stored in PostgreSQL
2. **Import existing data** - Use the migration tool
3. **Access from multiple devices** - Login from anywhere
4. **Set up backups** - Regular PostgreSQL backups
5. **Enable advanced features** - Multi-user collaboration, reporting, etc.

### 🆘 **Support**

If you encounter issues:
1. Check the logs in each service directory
2. Verify PostgreSQL installation and setup
3. Ensure all network ports are accessible
4. Review the troubleshooting section above

---

**Congratulations! Your Personal Finance Regulator is now using a professional database system! 🎉**
