// MongoDB initialization script
db = db.getSiblingDB('vida-rentals');

// Create application user
db.createUser({
  user: 'vida-app',
  pwd: 'vida-app-password',
  roles: [
    {
      role: 'readWrite',
      db: 'vida-rentals'
    }
  ]
});

// Create collections
db.createCollection('vehicles');
db.createCollection('bookings');
db.createCollection('users');

print('Database initialized successfully!');