use webdata;

CREATE TABLE if not exists input_data (
  name varchar(255) DEFAULT NULL,
  height int DEFAULT NULL,
  weight int DEFAULT NULL,
  gender varchar(255) DEFAULT NULL,
  age int DEFAULT NULL
);