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
  `lines_added` int NOT NULL,
  `lines_removed` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `member_name` (`member_name`),
  CONSTRAINT `git_daily_status_ibfk_1` FOREIGN KEY (`member_name`) REFERENCES `scrum_members` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=505 DEFAULT CHARSET=utf8

/* github pull request table */
CREATE TABLE `github_pull_requests` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `created_at` datetime NOT NULL COMMENT 'created_at',
  `closed_at` datetime DEFAULT NULL COMMENT 'close time',
  `pr_num` int NOT NULL,
  `member_name` int NOT NULL,
  `state` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pr_num` (`pr_num`),
  KEY `member_name` (`member_name`),
  CONSTRAINT `github_pull_requests_ibfk_1` FOREIGN KEY (`member_name`) REFERENCES `scrum_members` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8

/* github pull request reviews table */
CREATE TABLE `github_reviews` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `pr_num` int NOT NULL,
  `member_name` int NOT NULL,
  `submitted_at` datetime NOT NULL COMMENT 'submitted_at',
  PRIMARY KEY (`id`),
  KEY `member_name` (`member_name`),
  KEY `pr_num` (`pr_num`),
  CONSTRAINT `github_reviews_ibfk_1` FOREIGN KEY (`member_name`) REFERENCES `scrum_members` (`id`),
  CONSTRAINT `github_reviews_ibfk_3` FOREIGN KEY (`pr_num`) REFERENCES `github_pull_requests` (`pr_num`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8

/* fake jira board snapshot*/
CREATE TABLE `fake_jira_snapshot` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `total_backlog` int NOT NULL,
  `total_blocked` int NOT NULL,
  `total_bugs` int NOT NULL,
  `total_p0_bugs` int NOT NULL,
  `total_inprogress_epics` int NOT NULL,
  `total_completed_epics` int NOT NULL,
  `total_todo_epics` int NOT NULL,
  `current_sprint_todo` int NOT NULL,
  `current_sprint_inprog` int NOT NULL,
  `current_sprint_blocked` int NOT NULL,
  `current_sprint_review` int NOT NULL,
  `current_sprint_uat` int NOT NULL,
  `current_sprint_done` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8

/* fake current sprint story points distribution */
SELECT 
  now() as time,
  column_0 as "To DO",
  column_1 as "In Progress",
  column_2 as "Blocked",
  column_3 as "In Review",
  column_4 as "UAT",
  column_5 as "Done"
from 
 (values Row(15,  3,  2, 4, 12, 13)) as fake

/* jira sprint history */
CREATE TABLE `jira_sprints` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `start_date` datetime DEFAULT NULL COMMENT 'create time',
  `end_date` datetime DEFAULT NULL COMMENT 'update time',
  `sprint_id` int NOT NULL,
  `ticket_count` int NOT NULL,
  `completed_tickets` int NOT NULL,
  `completed_story_points` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sprint_id` (`sprint_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

/* jira sprint member contribution history */
CREATE TABLE `jira_sprints_members` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `member_name` int NOT NULL,
  `sprint_id` int NOT NULL,
  `completed_tickets` int NOT NULL,
  `completed_story_points` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `member_name` (`member_name`),
  KEY `sprint_id` (`sprint_id`),
  CONSTRAINT `jira_sprints_members_ibfk_1` FOREIGN KEY (`member_name`) REFERENCES `scrum_members` (`id`),
  CONSTRAINT `jira_sprints_members_ibfk_2` FOREIGN KEY (`sprint_id`) REFERENCES `jira_sprints` (`sprint_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8