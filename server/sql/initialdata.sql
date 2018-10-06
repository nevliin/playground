INSERT INTO auth_user(id, username, salted_hash) VALUES
    (1, 'test', '$2a$10$RXWQDx07CEN42z1/gIjflOU.NtaQ5sQkJbGCicy07laFTHsp5DgIO'),
    (2, 'test2', '$2a$10$RXWQDx07CEN42z1/gIjflOU.NtaQ5sQkJbGCicy07laFTHsp5DgIO'),
    (3, 'test3', '$2a$10$RXWQDx07CEN42z1/gIjflOU.NtaQ5sQkJbGCicy07laFTHsp5DgIO');
INSERT INTO auth_token(user_id, token) VALUES(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTUzODc3NDAyMSwiZXhwIjoxNTQxMzY2MDIxfQ.4AjJyZD7fJ9PzebjSt9WFxMxGt1dX78iiO44qMX3oUg');
INSERT INTO auth_role(id, display_name, name, power) VALUES
    (1, 'Root', 'root', 100),
    (2, 'User', 'user', 10),
    (3, 'Developer', 'dev', 50);
INSERT INTO auth_user_role(user_id, role_id) VALUES
    (1, 1),
    (1, 3),
    (2, 2);
