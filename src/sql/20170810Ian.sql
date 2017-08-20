/*
增加状态
*/
alter table tbl_school_info add column status tinyint(4) default 1 comment '状态 1有效 0 删除' after `attention`;

/*
增加拼音
*/
alter table tbl_tags add column t_pinyin varchar(200) default '' comment '标签拼音' after `t_name`;

/*
修改时间
*/
update tbl_teacher set t_update_time =  unix_timestamp(20170809120100) * 1000 ,t_create_time =  unix_timestamp(20170809120100) * 1000;