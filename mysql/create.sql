create database if not exists activity;

use activity;

create table if not exists page(
  _id int primary key auto_increment,
  globalStyle text not null,
  list longtext not null,
  name char(255) not null,
  description mediumtext,
  author tinytext,
  createTime timestamp default current_timestamp,
  updateTime timestamp default current_timestamp,
  unique(name)
)default charset=utf8;

create table if not exists pit(
  _id int primary key auto_increment,
  html longtext not null,
  css longtext not null,
  name char(255) not null,
  author tinytext,
  createTime timestamp default current_timestamp,
  disabled int,
  url tinytext,
  unique(name)
)default charset=utf8;

create table if not exists image(
  _id int primary key auto_increment,
  url text not null,
  createTime timestamp default current_timestamp
)default charset=utf8;
