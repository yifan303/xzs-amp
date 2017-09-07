use activity;

alter table page add disabled int default 1;

create table if not exists mode(
  _id int primary key auto_increment,
  html longtext not null,
  css longtext ,
  js longtext ,
  name char(255) not null,
  author tinytext,
  createTime timestamp default current_timestamp,
  disabled int default 1,
  url tinytext,
  unique(name)
)default charset=utf8;
