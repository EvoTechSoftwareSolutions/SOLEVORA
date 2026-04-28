# Admin Credentials

This document contains the default admin credentials for the SoleVora application.

## Default Admin Users

### System Administrator
- **Email**: admin@solevora.com
- **Password**: admin123
- **Role**: admin
- **Permissions**: Full system access

### Store Manager
- **Email**: manager@solevora.com
- **Password**: manager123
- **Role**: store_manager
- **Permissions**: Store management access

## How to Add These Users

If the admin users don't exist in the database, run the seeding script:

```bash
cd prisma-backend-js
npm run seed-admin
```

This will:
1. Check if admin users already exist
2. Create them if they don't exist
3. Display all current users in the database

## Security Notes

⚠️ **Important**: These are default credentials. For production:
- Change the default passwords immediately
- Use strong, unique passwords
- Consider implementing password policies
- Enable two-factor authentication if available

## User Roles

- **admin**: Full system access including user management, system settings, and all store operations
- **store_manager**: Store management access including product management, order management, and inventory
- **customer**: Regular customer access for shopping and profile management

## Database User Table

The users are stored in the `user` table with the following structure:
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: User role (admin, store_manager, customer)
- `status`: Account status (1 = active)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp
