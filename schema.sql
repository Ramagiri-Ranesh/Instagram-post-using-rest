CREATE TABLE posts(
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    img VARCHAR(500), 
    caption VARCHAR(50),
    likes INT,
    comments INT 
);

