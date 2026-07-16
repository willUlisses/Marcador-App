-- Tabela de Usuários
CREATE TABLE tb_users (
id BIGSERIAL PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE,
username VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
role VARCHAR(50) NOT NULL
);

-- Tabela de Livros
CREATE TABLE tb_books (
id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL,
title VARCHAR(255) NOT NULL,
rating INT CHECK (rating >= 1 AND rating <= 5),
status VARCHAR(50),
current_page INT NOT NULL DEFAULT 0,
total_pages INT NOT NULL,
opinion TEXT,
CONSTRAINT fk_books_user FOREIGN KEY (user_id) REFERENCES tb_users(id) ON DELETE CASCADE
);

-- Tabela de Gêneros dos Livros
CREATE TABLE tb_book_genres (
book_id BIGINT NOT NULL,
genre VARCHAR(50) NOT NULL,
CONSTRAINT fk_book_genres_book FOREIGN KEY (book_id) REFERENCES tb_books(id) ON DELETE CASCADE
);

-- Tabela de Reflexões
CREATE TABLE tb_reflections (
id BIGSERIAL PRIMARY KEY,
title VARCHAR(100) NOT NULL,
description TEXT,
book_id BIGINT NOT NULL,
CONSTRAINT fk_reflections_book FOREIGN KEY (book_id) REFERENCES tb_books(id) ON DELETE CASCADE
);