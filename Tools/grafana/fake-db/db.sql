/* team name and id table */
CREATE TABLE `scrum_teams` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `team_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_name` (`team_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8

/* team member name and id table */
CREATE TABLE `scrum_members` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `start_time` datetime NOT NULL COMMENT 'start time',
  `end_time` datetime DEFAULT NULL COMMENT 'end time',
  `member_name` varchar(255) NOT NULL COMMENT 'name',
  `team` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `member_name` (`member_name`),
  KEY `team` (`team`),
  CONSTRAINT `scrum_members_ibfk_1` FOREIGN KEY (`team`) REFERENCES `scrum_teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8


/* git daily code change table */
CREATE TABLE `git_daily_status` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `the_date` datetime NOT NULL,
  `member_name` int NOT NULL,
  `team` int NOT NULL,
  `lines_added` int DEFAULT 0,
  `lines_removed` int DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `member_name` (`member_name`),
  KEY `team` (`team`),
  CONSTRAINT `git_daily_status_ibfk_1` FOREIGN KEY (`member_name`) REFERENCES `scrum_members` (`id`),
  CONSTRAINT `git_daily_status_ibfk_2` FOREIGN KEY (`team`) REFERENCES `scrum_teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=505 DEFAULT CHARSET=utf8

/* github pull request table */
CREATE TABLE `github_pull_requests` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `created_at` datetime NOT NULL COMMENT 'create time',
  `closed_at` datetime DEFAULT NULL COMMENT 'close time',
  `pr_num` int NOT NULL,
  `member_name` int NOT NULL,
  `team` int NOT NULL,
  `state` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pr_num` (`pr_num`),
  KEY `member_name` (`member_name`),
  KEY `team` (`team`),
  CONSTRAINT `github_pull_requests_ibfk_1` FOREIGN KEY (`member_name`) REFERENCES `scrum_members` (`id`),
  CONSTRAINT `github_pull_requests_ibfk_2` FOREIGN KEY (`team`) REFERENCES `scrum_teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8

/* github pull request reviews table */
CREATE TABLE `github_reviews` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `pr_num` int NOT NULL,
  `member_name` int NOT NULL,
  `team` int NOT NULL,
  `submitted_at` datetime NOT NULL COMMENT 'submitted_at',
  PRIMARY KEY (`id`),
  KEY `member_name` (`member_name`),
  KEY `team` (`team`),
  KEY `pr_num` (`pr_num`),
  CONSTRAINT `github_reviews_ibfk_1` FOREIGN KEY (`member_name`) REFERENCES `scrum_members` (`id`),
  CONSTRAINT `github_reviews_ibfk_2` FOREIGN KEY (`team`) REFERENCES `scrum_teams` (`id`),
  CONSTRAINT `github_reviews_ibfk_3` FOREIGN KEY (`pr_num`) REFERENCES `github_pull_requests` (`pr_num`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8