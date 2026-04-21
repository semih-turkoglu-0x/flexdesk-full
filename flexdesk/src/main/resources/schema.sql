-- Schema reference only. Hibernate manages DDL via spring.jpa.hibernate.ddl-auto=update.
-- These statements are safe to run against an existing database.

CREATE TABLE IF NOT EXISTS users (
    user_id    integer      NOT NULL PRIMARY KEY,
    username   varchar(255) UNIQUE,
    first_name varchar(255),
    last_name  varchar(255),
    sur_name   varchar(255),
    password   varchar(255),
    is_admin   boolean      NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS activities (
    activity_id             integer      NOT NULL PRIMARY KEY,
    activity_name           varchar(255),
    activity_description    varchar(255),
    activity_time           timestamp,
    end_time                timestamp,
    category                varchar(255),
    requesting_user_user_id integer REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id          integer NOT NULL PRIMARY KEY,
    content             text,
    created_at          timestamp,
    activity_activity_id integer REFERENCES activities(activity_id),
    author_user_id       integer REFERENCES users(user_id)
);
