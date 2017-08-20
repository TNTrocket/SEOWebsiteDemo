alter table `tbl_article_types` add column at_create_time bigint(20) default 0 after at_status;
alter table `tbl_article_types` add column at_update_time bigint(20) default 0 after at_create_time;

alter table `tbl_article_types` add column at_title varchar(500) default null comment 'seo title' after at_enu_code3;
alter table `tbl_article_types` add column at_keywords varchar(500) default null comment 'seo keywords' after at_title;
alter table `tbl_article_types` add column at_description varchar(500) default null comment 'seo description' after at_keywords;