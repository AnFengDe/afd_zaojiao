--
-- Table structure for table `afd_blockchains`
--

DROP TABLE IF EXISTS `afd_blockchains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afd_blockchains` (
  `schoolid` varchar(32) NOT NULL COMMENT '所属教学点，不允许空',
  `timestamp` bigint(20) NOT NULL COMMENT '任务生成时间戳，单位毫秒',
  `task` varchar(2048) NOT NULL COMMENT '区块链相关任务',
  PRIMARY KEY (`schoolid`,`timestamp`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `afd_charge_list`
--

DROP TABLE IF EXISTS `afd_charge_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afd_charge_list` (
  `chargeid` varchar(32) NOT NULL COMMENT '缴费id',
  `childid` varchar(32) NOT NULL COMMENT '学生id',
  `child_name` varchar(16) NOT NULL COMMENT '学生姓名',
  `parentid` varchar(32) NOT NULL COMMENT '缴费家长id',
  `parent_name` varchar(16) NOT NULL COMMENT '缴费家长姓名',
  `schoolid` varchar(32) DEFAULT NULL COMMENT '所属教学点',
  `payment_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:费用(学费+伙食费) 1:学费,2:伙食费',
  `payment_time` date NOT NULL COMMENT '付款时间',
  `payment_begin` date NOT NULL COMMENT '学期开始时间',
  `payment_end` date NOT NULL COMMENT '学期结束时间',
  `payment_amount` decimal(9,2) NOT NULL COMMENT '付款金额',
  `teacherid` varchar(32) NOT NULL COMMENT '确认收费教师ID',
  `teacher_name` varchar(16) NOT NULL COMMENT '确认收费教师姓名 保留家长和教师姓名的原因是为了教师离职后仍然可以查询到数据',
  PRIMARY KEY (`chargeid`),
  UNIQUE KEY `childid` (`childid`,`payment_time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='报名缴费表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `afd_check`
--

DROP TABLE IF EXISTS `afd_check`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afd_check` (
  `childid` varchar(32) NOT NULL COMMENT '学生id',
  `childname` varchar(16) NOT NULL COMMENT '学生姓名',
  `checkid` varchar(32) NOT NULL COMMENT '接送人ID 可以是老师或者家长的id',
  `checkname` varchar(16) NOT NULL COMMENT '接送人姓名 可以是老师或者家长的姓名',
  `schoolid` varchar(32) NOT NULL COMMENT '所属教学点',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '默认0签到 1 签退',
  `checktime` datetime NOT NULL COMMENT '签到/退时间',
  `sendinfo` tinyint(1) NOT NULL DEFAULT '0' COMMENT '发送通知 (0 默认没有发送，1.已经发送)',
  PRIMARY KEY (`checktime`,`childid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='学生每日接送';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `afd_children`
--

DROP TABLE IF EXISTS `afd_children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afd_children` (
  `childid` varchar(32) NOT NULL COMMENT '学生ID,',
  `name` varchar(16) NOT NULL COMMENT '学生姓名',
  `schoolid` varchar(32) DEFAULT NULL COMMENT '所属教学点',
  `teacherid` varchar(32) DEFAULT NULL COMMENT '老师ID',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `picture` varchar(32) DEFAULT NULL COMMENT '个人照片路径',
  `sex` int(11) NOT NULL COMMENT '0:未知 1:男,2:女',
  `active` int(11) NOT NULL DEFAULT '0' COMMENT '0 没有入学 1 已经入学',
  `expired_date` date DEFAULT NULL COMMENT '空 表示没有缴费 有具体时间表示费用到期时间',
  `wallet` varchar(64) DEFAULT NULL COMMENT '学生钱包',
  PRIMARY KEY (`childid`),
  UNIQUE KEY `childid` (`childid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='学生信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `afd_parent`
--

DROP TABLE IF EXISTS `afd_parent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afd_parent` (
  `parentid` varchar(32) NOT NULL COMMENT '家长ID',
  `name` varchar(16) NOT NULL COMMENT '家长姓名',
  `mobile` varchar(20) NOT NULL COMMENT '手机',
  `schoolid` varchar(32) NOT NULL COMMENT '所属教学点，不允许空',
  `teacherid` varchar(32) DEFAULT NULL COMMENT '教师ID,此处教师ID可以理解为经办的老师也可以理解为孩子的老师',
  `childid1` varchar(32) NOT NULL COMMENT '孩子ID 可以多个家长关联一个孩子，但是家长至少要关联一个孩子',
  `childid2` varchar(32) DEFAULT NULL,
  `childid3` varchar(32) DEFAULT NULL,
  `childid4` varchar(32) DEFAULT NULL,
  `childid5` varchar(32) DEFAULT NULL,
  `childid6` varchar(32) DEFAULT NULL,
  `picture` varchar(128) DEFAULT NULL COMMENT '个人照片路径，没有的情况下采用微信头像',
  `primary_parent` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 默认不是 1第一联系人',
  `active` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 默认没有激活 1 激活代表有孩子入学,',
  `openid` varchar(64) NOT NULL COMMENT '家长必须有微信关注',
  `unionid` varchar(64) DEFAULT NULL COMMENT '微信返回的unionid 唯一key,',
  `subscribe` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否订阅0 没有 1订阅',
  `nickname` varchar(64) NOT NULL COMMENT '昵称',
  `sex` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 未知 1 男 2 女,性，值为0时是未知,',
  `city` varchar(32) NOT NULL COMMENT '城市',
  `country` varchar(32) NOT NULL COMMENT '国家',
  `province` varchar(32) NOT NULL COMMENT '省',
  `headimgurl` varchar(128) DEFAULT NULL COMMENT '头像路径',
  `groupid` tinyint(4) DEFAULT NULL COMMENT '分组id',
  `remark` varchar(32) DEFAULT NULL COMMENT '公众号对粉丝的备注',
  `language` varchar(8) NOT NULL COMMENT '用户语言',
  `subscribe_time` bigint(20) NOT NULL COMMENT '用户关注时间戳',
  `privilege` varchar(128) DEFAULT NULL COMMENT '用户特权信息，json 数组，如微信沃卡用户为（chinaunicom） ',
  PRIMARY KEY (`parentid`),
  UNIQUE KEY `parentid` (`parentid`),
  UNIQUE KEY `openid` (`openid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `afd_qr`
--

DROP TABLE IF EXISTS `afd_qr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afd_qr` (
  `schoolid` varchar(32) NOT NULL COMMENT '学校ID',
  `qr_key` varchar(64) NOT NULL COMMENT '扫码的KEY值',
  `type` tinyint(4) NOT NULL COMMENT '二维码类型：签到签退',
  `ticket` varchar(128) NOT NULL COMMENT '二维码ticket',
  `url` varchar(64) CHARACTER SET ucs2 NOT NULL COMMENT '二维码对应url',
  PRIMARY KEY (`schoolid`,`qr_key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `afd_register`
--

DROP TABLE IF EXISTS `afd_register`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afd_register` (
  `registerid` varchar(32) NOT NULL COMMENT '预约登记ID',
  `register_time` datetime NOT NULL,
  `child_name` varchar(16) DEFAULT NULL COMMENT '小孩姓名',
  `child_birthday` date DEFAULT NULL COMMENT '小孩生日，用户输入单位可能是月，需要换算',
  `parent_name` varchar(16) NOT NULL COMMENT '家长姓名',
  `parent_mobile` varchar(20) NOT NULL COMMENT '家长手机',
  `schoolid` varchar(32) NOT NULL COMMENT '教学点ID',
  `openid` varchar(64) NOT NULL,
  PRIMARY KEY (`registerid`),
  KEY `register_time` (`register_time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `afd_school`
--

DROP TABLE IF EXISTS `afd_school`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afd_school` (
  `schoolid` varchar(32) NOT NULL COMMENT '教学点ID，唯一key,',
  `name` varchar(64) NOT NULL COMMENT '教学点名称',
  `address` varchar(128) NOT NULL COMMENT '地址',
  `leader` varchar(16) NOT NULL COMMENT '负责人姓名 负责人和管理员可以不是同一个人',
  `mobile` varchar(20) NOT NULL COMMENT '负责人手机',
  `wallet` varchar(64) DEFAULT NULL COMMENT '学校钱包秘钥',
  PRIMARY KEY (`schoolid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `afd_school_admin`
--

DROP TABLE IF EXISTS `afd_school_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afd_school_admin` (
  `openid` varchar(64) NOT NULL COMMENT '管理员必须有微信关注',
  `name` varchar(16) NOT NULL COMMENT '姓名 这个需要填写',
  `mobile` varchar(20) NOT NULL COMMENT '手机 这个需要填写',
  `schoolid` varchar(32) NOT NULL COMMENT '教学点（学校）编码, 必填',
  `active` tinyint(1) NOT NULL DEFAULT '0' COMMENT '默认0，激活为1',
  `unionid` varchar(64) DEFAULT NULL COMMENT '微信返回的unionid 唯一key,',
  `subscribe` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否订阅0 没有 1订阅',
  `nickname` varchar(64) NOT NULL COMMENT '昵称',
  `sex` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 未知 1 男 2 女,性，值为0时是未知,',
  `city` varchar(32) NOT NULL COMMENT '城市',
  `country` varchar(32) NOT NULL COMMENT '国家',
  `province` varchar(32) NOT NULL COMMENT '省',
  `headimgurl` varchar(128) DEFAULT NULL COMMENT '头像路径',
  `groupid` tinyint(4) DEFAULT NULL COMMENT '分组id',
  `remark` varchar(32) DEFAULT NULL COMMENT '公众号对粉丝的备注',
  `language` varchar(8) NOT NULL COMMENT '用户语言',
  `subscribe_time` bigint(20) NOT NULL COMMENT '用户关注时间戳',
  `privilege` varchar(128) DEFAULT NULL COMMENT '用户特权信息，json 数组，如微信沃卡用户为（chinaunicom） ',
  PRIMARY KEY (`openid`),
  UNIQUE KEY `openid` (`openid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='学校管理员';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `afd_teachers`
--

DROP TABLE IF EXISTS `afd_teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afd_teachers` (
  `teacherid` varchar(32) NOT NULL COMMENT '教师ID',
  `name` varchar(16) NOT NULL COMMENT '教师姓名',
  `mobile` varchar(20) NOT NULL COMMENT '手机号码',
  `schoolid` varchar(32) NOT NULL COMMENT '所属教学点',
  `picture` varchar(128) DEFAULT NULL COMMENT '个人照片路径没有则采用微信头像',
  `active` tinyint(1) NOT NULL DEFAULT '0' COMMENT '默认0，激活为1',
  `openid` varchar(64) NOT NULL COMMENT '家长必须有微信关注',
  `unionid` varchar(64) DEFAULT NULL COMMENT '微信返回的unionid 唯一key,',
  `subscribe` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否订阅0 没有 1订阅',
  `nickname` varchar(64) NOT NULL COMMENT '昵称',
  `sex` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 未知 1 男 2 女,性，值为0时是未知,',
  `city` varchar(32) NOT NULL COMMENT '城市',
  `country` varchar(32) NOT NULL COMMENT '国家',
  `province` varchar(32) NOT NULL COMMENT '省',
  `headimgurl` varchar(128) NOT NULL COMMENT '头像路径',
  `groupid` tinyint(4) DEFAULT NULL COMMENT '分组id',
  `remark` varchar(32) DEFAULT NULL COMMENT '公众号对粉丝的备注',
  `language` varchar(8) NOT NULL COMMENT '用户语言',
  `subscribe_time` bigint(20) NOT NULL COMMENT '用户关注时间戳',
  `privilege` varchar(128) DEFAULT NULL COMMENT '用户特权信息，json 数组，如微信沃卡用户为（chinaunicom） ',
  PRIMARY KEY (`teacherid`),
  UNIQUE KEY `openid` (`openid`),
  UNIQUE KEY `teacherid` (`teacherid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='教师信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `afd_users`
--

DROP TABLE IF EXISTS `afd_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afd_users` (
  `openid` varchar(64) NOT NULL COMMENT '微信返回的openid 唯一key',
  `unionid` varchar(64) DEFAULT NULL COMMENT '微信返回的unionid 唯一key,',
  `subscribe` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否订阅0 没有 1订阅',
  `nickname` varchar(64) NOT NULL COMMENT '昵称',
  `sex` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 未知 1 男 2 女,性，值为0时是未知,',
  `city` varchar(32) NOT NULL COMMENT '城市',
  `country` varchar(32) NOT NULL COMMENT '国家',
  `province` varchar(32) NOT NULL COMMENT '省',
  `headimgurl` varchar(128) NOT NULL COMMENT '头像路径',
  `groupid` tinyint(4) DEFAULT NULL COMMENT '分组id',
  `remark` varchar(32) DEFAULT NULL COMMENT '公众号对粉丝的备注',
  `language` varchar(8) NOT NULL COMMENT '用户语言',
  `subscribe_time` bigint(20) NOT NULL COMMENT '用户关注时间戳',
  `privilege` varchar(128) DEFAULT NULL COMMENT '用户特权信息，json 数组，如微信沃卡用户为（chinaunicom） ',
  PRIMARY KEY (`openid`),
  UNIQUE KEY `openid` (`openid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='用户信息管理';
