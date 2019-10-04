INSERT INTO caterers (caterer_name, caterer_website, caterer_price, caterer_type, caterer_rating, caterer_pros, caterer_cons, user_id)
VALUES
    ('Panera', 'www.panera.com', '$15', 'Bread', '2', ARRAY['cheap', 'bread is good'], ARRAY['not many options', 'not classy'], '1'),
    ('Fancy Food', 'www.fancyfood.com', '$100', 'Italian', '4', ARRAY['very tasty', 'elegant'], ARRAY['expensive'], '1');