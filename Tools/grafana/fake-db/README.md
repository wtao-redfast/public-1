# Fake MySQL database to display scrum activities in Grafana

0. Access database

    0.1. Use Visual Studio Code extension: MySQL
    https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2

    0.2. Use mysqlsh shell
- When running the shell, use `\c` to log in database; use `sql` to execute a sql command; use `quit` to quit.
```bash
[mysqlsh prompt]\c grafana:grafana@localhost
[mysqlsh prompt]\sql select * from scrums.daily_status
[mysqlsh prompt]\quit
```
- Or, use the shell program with parameters to execute sql directly, e.g.
```bash
mysqlsh -u grafana --database=scrums --sql << EOF
> SELECT COUNT(DISTINCT(member_name)) as value
> FROM daily_status
> WHERE team="alpha"
> EOF
```

1. Create database

```sql
CREATE DATABASE scrums;
```

verify database
verify schema
```sql
SHOW DATABASES;
```

2. Create table

- source code activity table
table schema: | date | name | team | lines_added | lines_removed |

```sql
CREATE TABLE scrums.daily_status(
    id INT NOT NULL AUTO_INCREMENT,
    the_date DATE NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    team VARCHAR(255) NOT NULL,
    lines_added INT NOT NULL,
    lines_removed INT NOT NULL,
    PRIMARY KEY (id),
    INDEX (the_date),
    INDEX (member_name),
    INDEX (team)
);
```

verify schema
```sql
DESCRIBE scrums.daily_status;
```

- team sprint activity table
table schema: | start_date | name | team | total_tickets | total_storypoints | completed_tickets | completed_storypoints

```sql
CREATE TABLE scrums.sprint_team(
    id INT NOT NULL AUTO_INCREMENT,
    start_date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    team VARCHAR(255) NOT NULL,
    total_tickets INT NOT NULL,
    total_storypoints INT NOT NULL,
    completed_tickets INT NOT NULL,
    completed_storypoints INT NOT NULL,
    PRIMARY KEY (id),
    INDEX (start_date),
    INDEX (name),
    INDEX (team)
);
```

- team current sprint activity table
table schema: | sprint_name | team | total_todo | total_inprogress | total_blocked | total_completed | days_remained
```sql
CREATE TABLE scrums.current_sprint_team(
    sprint_name VARCHAR(255) NOT NULL,
    team VARCHAR(255) NOT NULL,
    total_tickets INT NOT NULL,
    total_todo INT NOT NULL,
    total_inprogress INT NOT NULL,
    total_blocked INT NOT NULL,
    total_completed INT NOT NULL,
    days_remained INT NOT NULL,
    PRIMARY KEY (team)
);
```

3. Create a user to access the table above
```sql
CREATE USER grafana IDENTIFIED BY '[new_password]';
```

verify user
```sql
SELECT USER from mysql.user;
```

grant full access to the table
```sql
GRANT ALL PRIVILEGES ON scrums.* To grafana;
FLUSH PRIVILEGES;
```

verify grant
```sql
SHOW GRANTS FOR grafana
```

4. Fill dummy data to the table using python
- install mysql python connector [download](https://dev.mysql.com/doc/connector-python/en/connector-python-installation-binary.html)
- read through the example code [here](https://dev.mysql.com/doc/connector-python/en/connector-python-examples.html)


5. sql commands used
```sql
SELECT the_date AS "time", SUM(lines_added+lines_removed)
FROM daily_status
WHERE team = "alpha"
GROUP BY the_date
ORDER BY the_date
```

```sql
SELECT
    the_date AS "time",
    member_name AS metric,
    lines_added + lines_removed
FROM daily_status
WHERE team = "alpha"
ORDER BY the_date
```

```sql
SELECT COUNT(DISTINCT(member_name)) as value
FROM daily_status
WHERE team="alpha"
```

```sql
/* aggregate code line changes by week*/
SELECT
   scrum_members.member_name as Name,
   scrum_teams.team_name as Team,
   SUM(lines_added) as LineAdded,
   SUM(lines_removed) as LineRemoved
FROM git_daily_status
   INNER JOIN scrum_members ON git_daily_status.member_name = scrum_members.id
   INNER JOIN scrum_teams ON git_daily_status.team = scrum_teams.id
WHERE '2020-12-12' <= the_date AND the_date <= '2020-12-19'
GROUP BY scrum_members.member_name, scrum_teams.team_name
ORDER BY scrum_members.member_name
```