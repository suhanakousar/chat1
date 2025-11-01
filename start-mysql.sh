#!/bin/bash

# MySQL data directory
MYSQL_DIR="/home/runner/.mysql"
SOCKET_PATH="/tmp/mysql.sock"
PID_FILE="/tmp/mysql.pid"

# Create data directory if it doesn't exist
if [ ! -d "$MYSQL_DIR" ]; then
    echo "Initializing MySQL database..."
    mkdir -p "$MYSQL_DIR"
fi

# Start MySQL server
echo "Starting MySQL server..."
mysqld --datadir="$MYSQL_DIR" \
    --socket="$SOCKET_PATH" \
    --pid-file="$PID_FILE" \
    --bind-address=127.0.0.1 \
    --port=3306 \
    --skip-networking=0 \
    --innodb_use_native_aio=0 &

# Wait for MySQL to start
echo "Waiting for MySQL to start..."
sleep 5

# Create database and user if needed
echo "Setting up database..."
mysql --socket="$SOCKET_PATH" -u root <<EOF
CREATE DATABASE IF NOT EXISTS unifychat_db;
GRANT ALL PRIVILEGES ON unifychat_db.* TO 'root'@'127.0.0.1' IDENTIFIED BY 'suhana2005';
GRANT ALL PRIVILEGES ON unifychat_db.* TO 'root'@'localhost' IDENTIFIED BY 'suhana2005';
FLUSH PRIVILEGES;
EOF

echo "MySQL is ready!"
