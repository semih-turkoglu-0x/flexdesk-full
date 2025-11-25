CREATE TABLE users (
                       user_id     SERIAL PRIMARY KEY,
                       username    VARCHAR(255) UNIQUE NOT NULL,
                       first_name  VARCHAR(255),
                       last_name   VARCHAR(255),
                       sur_name    VARCHAR(255),
                       password    TEXT NOT NULL,
                       is_admin    BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE activities (
                            activity_id      SERIAL PRIMARY KEY,
                            activity_time    TIMESTAMP NOT NULL,
                            end_time         TIMESTAMP,
                            name             VARCHAR(255) NOT NULL,
                            description      TEXT,
                            requesting_user  INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
                            category         VARCHAR(255)
);

CREATE TABLE comments (
                          comment_id SERIAL PRIMARY KEY,
                          content    TEXT,
                          created_at TIMESTAMP,
                          activity_id INTEGER REFERENCES activities(activity_id) ON DELETE CASCADE,
                          author_id   INTEGER REFERENCES users(user_id) ON DELETE SET NULL
);