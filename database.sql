CREATE DATABASE movie;

CREATE TABLE users(
    user_id uuid DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    PRIMARY KEY(user_id)
);

CREATE TABLE movie_list(
    movie_list_id SERIAL,
    user_id uuid,
    modified_date TIMESTAMP(0) WITH TIME ZONE DEFAULT (NOW()), --should be joined date, in user table
    movie_list_json TEXT NOT NULL, --TYPE TEXT saves up to 1GB
    PRIMARY KEY(movie_list_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO users (
    user_email, user_password
) VALUES (
    'testing@test.com', 'testingPassword123' --single quote for auto-dealer
);

INSERT INTO movie_list (
    movie_list_json, user_id
) VALUES (
    '[{"id":123123,"watched":true},{"id":123456,"watched":false}]',
    (SELECT user_id from users WHERE user_id='e6632b42-75ad-4f58-b125-2f4e540c9522')
);

--read last record

SELECT movie_list_json FROM movie_list WHERE user_id='e6632b42-75ad-4f58-b125-2f4e540c9522' ORDER BY modified_date DESC LIMIT 1;

--update list

UPDATE movie_list SET movie_list_json = '[{"id":123123,"watched":true},{"id":123456,"watched":false}]' WHERE user_id = '303cadb3-973e-41fe-bbe3-a7090f961a58';