#!/bin/bash

# MySQL configuration
MYSQL_DIR="/home/runner/.mysql"
SOCKET_PATH="/tmp/mysql.sock"
PID_FILE="/tmp/mysql.pid"

# Function to check if MySQL is running
is_mysql_running() {
    if [ -f "$PID_FILE" ] && ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
        return 0
    fi
    return 1
}

# Start MySQL if not already running
if ! is_mysql_running; then
    echo "Starting MySQL server..."
    
    # Check if data directory exists and is initialized
    if [ ! -d "$MYSQL_DIR/mysql" ]; then
        echo "MySQL data directory not initialized. Database will not be available."
        echo "Please note: MySQL initialization has issues in this environment."
    else
        # Try to start MySQL server
        mysqld --datadir="$MYSQL_DIR" \
            --socket="$SOCKET_PATH" \
            --pid-file="$PID_FILE" \
            --bind-address=127.0.0.1 \
            --port=3306 \
            --skip-networking=0 \
            --innodb_use_native_aio=0 &
        
        # Wait a bit for MySQL to start
        sleep 3
    fi
fi

# Start the backend server
echo "Starting backend server..."
cd /home/runner/Azure_Hack_FE/backend
npm start
