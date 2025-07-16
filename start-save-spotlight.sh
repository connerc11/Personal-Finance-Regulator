#!/bin/bash

echo "Starting Personal Finance Regulator Services..."

# Start the database first (assuming PostgreSQL is running)
echo "✓ Database should be running on port 5432"

# Start User Service
echo "Starting User Service on port 8081..."
cd user-service && mvn spring-boot:run &
USER_PID=$!

# Wait a bit for user service to start
sleep 10

# Start API Gateway
echo "Starting API Gateway on port 8080..."
cd ../api-gateway && mvn spring-boot:run &
GATEWAY_PID=$!

# Wait a bit for gateway to start
sleep 10

# Start Frontend Development Server
echo "Starting Frontend on port 3000..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo ""
echo "==================================="
echo "Services Started Successfully!"
echo "==================================="
echo "• API Gateway: http://localhost:8080"
echo "• User Service: http://localhost:8081"
echo "• Frontend: http://localhost:3000"
echo ""
echo "Save Spotlight endpoints:"
echo "• Chat Rooms: http://localhost:8080/api/users/save-spotlight/chat/rooms"
echo "• Shared Goals: http://localhost:8080/api/users/save-spotlight/goals"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to press Ctrl+C
trap "echo 'Stopping services...'; kill $USER_PID $GATEWAY_PID $FRONTEND_PID; exit" INT
wait
