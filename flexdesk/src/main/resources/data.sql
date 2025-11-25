INSERT INTO flexdesk.public.users (is_admin, user_id, first_name, last_name, password, sur_name) VALUES
                                                                                                     (TRUE, 1, 'Alice', 'Dupont', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'Al'),
                                                                                                     (FALSE, 2, 'Bob', 'Martin', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'Bm'),
                                                                                                     (FALSE, 3, 'Chloé', 'Petit', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'Cp'),
                                                                                                     (TRUE, 4, 'David', 'Grand', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'Dg');
INSERT INTO flexdesk.public.activities
(activity_id, requesting_user_user_id, activity_time, activity_name, activity_description, category)
VALUES
    (10, 1, '2025-12-01 09:00:00', 'Réunion de lancement', 'Planification du projet Q1 avec les équipes design et dev.', 'Réunion'),
    (11, 2, '2025-12-01 14:30:00', 'Focus sur le Backend', 'Session de codage intensif sans interruption.', 'Focus'),
    (12, 4, '2025-12-02 11:00:00', 'Interview candidat A', 'Entretien de recrutement pour le poste de développeur junior.', 'RH'),
    (13, 3, '2025-12-03 16:00:00', 'Call client important', 'Point hebdomadaire avec le client principal.', 'Client'),
    (14, 1, '2025-12-03 10:00:00', 'Standup Matinal', 'Point rapide sur les tâches du jour.', 'Réunion');
