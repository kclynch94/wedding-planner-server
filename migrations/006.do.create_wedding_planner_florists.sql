CREATE TABLE florists (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    florist_name TEXT NOT NULL,
    florist_website TEXT,
    florist_price TEXT,
    florist_rating TEXT,
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL
);