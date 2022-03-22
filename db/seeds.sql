INSERT INTO departments (name)
VALUES
    ('Engineering'),
    ('Project Management'),
    ('Sales'),
    ('UI'),
    ('UX');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Junior Developer', 60000, 1),
    ('Software Engineer', 140000, 1),
    ('Tech-Sales', 80000, 3),
    ('Project Manager', 140000, 2),
    ('UI Developer', 65000, 4),
    ('UX Developer', 65000, 5),
    ('Senior Software Engineer', 180000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Ronald', 'Firbank', 2, 4),
    ('Virginia', 'Woolf', 4, 19),
    ('Piers', 'Gaveston', 2, 2),
    ('Charles', 'LeRoi', 5, NULL),
    ('Katherine', 'Mansfield', 2, 1),
    ('Dora', 'Carrington', 3, 1),
    ('Edward', 'Bellamy', 3, 1),
    ('Montague', 'Summers', 3, 2),
    ('Octavia', 'Butler', 3, 1),
    ('Unica', 'Zurn', 4, 1),
    ('Ronald', 'Firbank', 1, 1),
    ('Virginia', 'Woolf', 4, 2),
    ('Piers', 'Gaveston', 1, 2),
    ('Charles', 'LeRoi', 2, 1),
    ('Katherine', 'Mansfield', 2, 1),
    ('Dora', 'Carrington', 3, 1),
    ('Edward', 'Bellamy', 4, 0),
    ('Montague', 'Summers', 3, 2),
    ('Octavia', 'Butler', 3, 2),
    ('Unica', 'Zurn', 5, NULL);