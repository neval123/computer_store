# Web application featuring an online computer store
# Prerequisities
- docker (optionally)
- Node.js
- Java
- MySQL
# Client
Installation:
```
npm install
```
Build and run:
```
npm run build
npm start
```
# Server
Setup the .env variable in /server catalogue:
```
DB_URL=jdbc:mysql://example:3306/example_db
DB_USERNAME=your_user
DB_PASSWORD=your_password

#SMTP configuration (for sending emails)
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_password # Use your email password or app-specific password
SECRET_KEY=your_secret_key
IMAGE_UPLOAD_URL=/absolute/path/to/static/images
```
Ensure that the database is running and run te project via the IDE of your choice.
