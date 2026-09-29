# Muaraversa Database

## Migration Source

Database structure is maintained through the migration files inside `database/migrations/`.

## Migration Order

1. 001_initial.sql
2. 001_roles.sql
3. 002_users.sql
4. 003_sessions.sql
5. 004_school.sql
6. 005_teachers.sql
7. 006_students.sql
8. 007_classes.sql

## Notes

`schema.sql` is kept as a reference snapshot.

For deployment and database initialization, use the migration files as the source of truth.
