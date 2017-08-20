CREATE TABLE `tbl_related_url` (
  `ru_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ru_name` varchar(50) NOT NULL DEFAULT '' COMMENT '链接名称',
  `ru_url` varchar(200) NOT NULL DEFAULT '' COMMENT '链接',
  `ru_status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态 1：有效 0：删除',
  `ru_create_by` int(11) NOT NULL DEFAULT '0' COMMENT '创建者',
  `ru_update_by` int(11) NOT NULL DEFAULT '0' COMMENT '最后更新者',
  `ru_create_time` bigint(20) NOT NULL DEFAULT '0',
  `ru_update_time` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ru_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*
banner 添加 无忧外教移动 新的图片
*/
INSERT INTO `tbl_banner` (`b_id`, `b_status`, `b_title`, `b_path`, `b_target`, `b_cityID`, `b_sort`, `b_remark`, `b_update_time`, `b_create_time`)
VALUES
	(16, 1, '无忧外教', 'http://cdn.seo.51xuanshi.com/banner_foreignTeacher.jpg', 'http://mp.weixin.qq.com/s/x_xkrnMdMg5vHVGU5WOSbA', 440400, 5, NULL, 0, 0),
	(17, 1, '无忧外教', 'http://cdn.seo.51xuanshi.com/banner_foreignTeacher.jpg', 'http://mp.weixin.qq.com/s/x_xkrnMdMg5vHVGU5WOSbA', 440300, 5, NULL, 0, 0),
	(18, 1, '无忧外教', 'http://cdn.seo.51xuanshi.com/banner_foreignTeacher.jpg', 'http://mp.weixin.qq.com/s/x_xkrnMdMg5vHVGU5WOSbA', 440100, 5, NULL, 0, 0);


/*
创建tbl_column 表
*/
CREATE TABLE `tbl_column` (
  `c_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `c_name` varchar(50) NOT NULL DEFAULT '' COMMENT '栏目名称',
  `c_level` tinyint(4) NOT NULL COMMENT '层级',
  `c_url` varchar(200) NOT NULL DEFAULT '' COMMENT '链接',
  `c_title` varchar(500) NOT NULL DEFAULT '' COMMENT '标题',
  `c_keywords` varchar(500) NOT NULL DEFAULT '' COMMENT '关键词',
  `c_description` varchar(500) NOT NULL DEFAULT '' COMMENT '描述',
  `c_status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态 1：有效 0：删除',
  `c_update_time` bigint(20) NOT NULL DEFAULT '0' COMMENT '更新时间',
  `c_create_time` bigint(20) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `c_update_by` int(11) NOT NULL DEFAULT '0' COMMENT '最后操作者',
  `c_create_by` int(11) NOT NULL DEFAULT '0' COMMENT '创建者',
  PRIMARY KEY (`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COMMENT='栏目表';



/*
初始化tbl_column数据
*/

INSERT INTO `tbl_column` (`c_id`, `c_name`, `c_level`, `c_url`, `c_title`, `c_keywords`, `c_description`, `c_status`, `c_update_time`, `c_create_time`, `c_update_by`, `c_create_by`)
VALUES
	(1, '首页', 0, '/', '【选师无忧】家教一对一辅导_中小学名师上门辅导_权威家教网', '家教一对一辅导,家教网,中小学家教,家教辅导,家教老师', '【选师无忧】权威家教网,为每个孩子找个合适的家教好老师，名师家教一对一辅导,通过大数据帮助老师和学生精准对接，有效提高孩子学习成绩,中国最专业的中小学老师预约平台', 1, 0, 0, 0, 0),
	(2, '{area}频道', 1, '/{cityPinyin}/', '{area}中小学家教辅导_{area}一对一家教辅导_{area}最好的家教辅导中心【选师无忧】', '{area}一对一家教辅导,{area}中小学家教辅导,{area}家教,{area}家教辅导老师,{area}家教中心,{area}家教老师,{area}家教网', ' {area}家教权威品牌,{area}名师一对一上门家教辅导,提供小学、初中、高中上门一对一家教,快速提高学生成绩。精选名师,包括{area}重点中小学教师、{area}名校大学生家教、{area}家教机构等,让家长足不出户找到合适的好老师。', 1, 0, 0, 0, 0),
	(3, '升学资讯', 2, '/{cityPinyin}/zixun/', '\n{area}中小学家教升学指南_{area}小升初/中考/高考升学攻略大全资讯【选师无忧】', '中小学考试资料下载,教育资讯,升学指南', '选师无忧升学资讯频道,汇集海量的国内小升初/中考/高考升学资讯，为你提供中小学学习资料下载，奥赛信息,升学知识题库以及全国各中小学校、大学院校资料等升学信息', 1, 0, 0, 0, 0),
	(4, '无忧资讯', 2, '/{cityPinyin}/wuyou-/', '{area}中小学家教升学资讯大全', '升学资讯大全', '{area}无忧资讯大全,汇集海量的国内小升初/中考/高考升学资讯，快速提升你的孩子成绩', 1, 0, 0, 0, 0),
	(5, '无忧英语', 2, '/{cityPinyin}/english/', '【选师无忧】英语学习辅导_英语学习一对一辅导_英语家教辅导', '英语学习辅导,英语学习一对一辅导,英语家教辅导', '外教1对1家教辅导,边学边用,更快更扎实掌握口语,采取独特的英语口语和听力培训方式,全面提升你孩子的英语', 1, 0, 0, 0, 0),
	(6, '提分案例', 2, '/{cityPinyin}/case/', '【选师无忧】最新小升初/初中/高中辅导提分案例_中小学个性化辅导提分专家', '', '14年中小学家教辅导经验,通过大数据帮助老师和学生精准对接,95%学员辅导一个月后成绩显著提升，看家长们说 在家就能试听课程， 试听满意再付费，全程班主任保障服务', 1, 0, 0, 0, 0),
	(7, '加入我们', 2, '/about/join.html', '加入我们_选师无忧', '', '调取正文前30个字', 1, 0, 0, 0, 0),
	(8, '联系我们', 2, '/about/us.html', '联系我们_选师无忧', '', '调取正文前30个字', 1, 0, 0, 0, 0),
	(9, 'APP下载', 2, '/about/app.html', '家长APP下载_家教辅导APP免费下载', '家长APP下载,家教辅导APP免费下载', '选师无忧APP,专业一对一家教app,14年中小学家教辅导经验,通过大数据帮助老师和学生精准对接，有效提高孩子学习成绩', 1, 0, 0, 0, 0),
	(10, '名师库', 2, '/teachers/{cityPinyin}/s-/', '{area}家教老师】_{area}一对一辅导老师_{area}找家教辅导老师_选师无忧', '家教老师', '{area}专业一对一家教辅导老师_让家长找到合适的好老师,通过大数据帮助学生精准对接重点中小学教师{area}名校大学生,快速提高孩子的成绩，包括数理化、语文、英语等传统科目的辅导', 1, 0, 0, 0, 0),
	(11, '学校列表', 2, '/schools/{cityPinyin}/school-/', '{area}中小学辅导资料免费下载_最新小升初/初中/高中试题下载_教材资料免费下载', '资料免费下载', '选师无忧提供{area}最新小升初/初中/高中辅导资料免费下载,汇集全国各地小学/初中/高中考试试题,真题题库,升学资讯资料下载等', 1, 0, 0, 0, 0),
	(12, '家长问答', 2, '/wd/{cityPinyin}/wenda-/', '{area}升学辅导家教问答_解决家教辅导问题的专业平台', '家长问答', '选师无忧14年的中小学家教辅导经验,提供最新小升初/初中/高中升学问答以及家长/老师的常见问题等', 1, 0, 0, 0, 0);
