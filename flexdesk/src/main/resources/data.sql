-- Password 'admin' for all seed users
INSERT INTO users (username, first_name, last_name, sur_name, password, is_admin) VALUES
    ('alice', 'Alice', 'Dupont',  'Al', '$2a$10$Z7vkc9a8zyhJrntlVosHoujXOC6gE08CQHmu/bTRAdAbREuqcvJJu', TRUE),
    ('bob',   'Bob',   'Martin',  'Bm', '$2a$10$Z7vkc9a8zyhJrntlVosHoujXOC6gE08CQHmu/bTRAdAbREuqcvJJu', FALSE),
    ('chloe', 'Chloé', 'Petit',   'Cp', '$2a$10$Z7vkc9a8zyhJrntlVosHoujXOC6gE08CQHmu/bTRAdAbREuqcvJJu', FALSE),
    ('david', 'David', 'Grand',   'Dg', '$2a$10$Z7vkc9a8zyhJrntlVosHoujXOC6gE08CQHmu/bTRAdAbREuqcvJJu', TRUE)
ON CONFLICT (username) DO NOTHING;

INSERT INTO activities (requesting_user_user_id, activity_time, end_time, activity_name, activity_description, category)
SELECT u.user_id, '2025-12-01 09:00:00', '2025-12-01 10:00:00',
       'Réunion de lancement', 'Planification du projet Q1 avec les équipes design et dev.', 'Réunion'
FROM users u WHERE u.username = 'alice'
AND NOT EXISTS (SELECT 1 FROM activities WHERE activity_name = 'Réunion de lancement');

INSERT INTO activities (requesting_user_user_id, activity_time, end_time, activity_name, activity_description, category)
SELECT u.user_id, '2025-12-01 14:30:00', '2025-12-01 15:30:00',
       'Focus sur le Backend', 'Session de codage intensif sans interruption.', 'Focus'
FROM users u WHERE u.username = 'bob'
AND NOT EXISTS (SELECT 1 FROM activities WHERE activity_name = 'Focus sur le Backend');

INSERT INTO activities (requesting_user_user_id, activity_time, end_time, activity_name, activity_description, category)
SELECT u.user_id, '2025-12-02 11:00:00', '2025-12-02 12:00:00',
       'Interview candidat A', 'Entretien de recrutement pour le poste de développeur junior.', 'RH'
FROM users u WHERE u.username = 'david'
AND NOT EXISTS (SELECT 1 FROM activities WHERE activity_name = 'Interview candidat A');

INSERT INTO activities (requesting_user_user_id, activity_time, end_time, activity_name, activity_description, category)
SELECT u.user_id, '2025-12-03 16:00:00', '2025-12-03 17:00:00',
       'Call client important', 'Point hebdomadaire avec le client principal.', 'Client'
FROM users u WHERE u.username = 'chloe'
AND NOT EXISTS (SELECT 1 FROM activities WHERE activity_name = 'Call client important');

INSERT INTO activities (requesting_user_user_id, activity_time, end_time, activity_name, activity_description, category)
SELECT u.user_id, '2025-12-03 10:00:00', '2025-12-03 10:30:00',
       'Standup Matinal', 'Point rapide sur les tâches du jour.', 'Réunion'
FROM users u WHERE u.username = 'alice'
AND NOT EXISTS (SELECT 1 FROM activities WHERE activity_name = 'Standup Matinal');
