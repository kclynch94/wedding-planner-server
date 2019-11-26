CREATE TABLE cons (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    con_content TEXT NOT NULL,
    con_type TEXT NOT NULL,
    ref_id INTEGER NOT NULL,
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL
);