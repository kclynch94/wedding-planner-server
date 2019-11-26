CREATE TABLE pros (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    pro_content TEXT NOT NULL,
    pro_type TEXT NOT NULL,
    ref_id INTEGER NOT NULL,
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL
);