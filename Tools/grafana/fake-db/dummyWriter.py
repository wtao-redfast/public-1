import mysql.connector
import datetime
import random

databaseName = 'scrums'
teamNames = ['alpha', 'beta']
teamMemberNames = [
    [
        'Stephanie',
        'Kylie',
        'Sebastian',
        'Thomas',
        'Andrew'
    ],
    [
        'Adam',
        'Carol',
        'Abigail',
        'Dylan'
    ]
]
teamMemberPRs = [
    [
        4,
        1,
        3,
        3,
        6
    ],
    [
        2,
        2,
        4,
        1
    ]
]
numOfDays = 56
startDate = datetime.datetime(2020, 12, 12) 

class RecordBase:
    def __init__(self, connetcor, cursor):
        self.cnx = connetcor
        self.cursor = cursor

    def getScrumMemberId(self, memberName):
        sql = f'SELECT * FROM scrum_members WHERE member_name = "{memberName}"'
        self.cursor.execute(sql)
        result = self.cursor.fetchone()
        if self.cursor.rowcount != 1:
            raise Exception('unexpected scrum member name')
        return result[0]

    def getScrumTeamId(self, teamName):
        sql = f'SELECT * FROM scrum_teams WHERE team_name = "{teamName}"'
        self.cursor.execute(sql)
        result = self.cursor.fetchone()
        if self.cursor.rowcount != 1:
            raise Exception('unexpected scrum team name')
        return result[0]

class RecordSourceCode(RecordBase):
    def writeSourceCodeRecord(self, date, member, linesAdded, linesRemoved):
        memberId = self.getScrumMemberId(member)

        sql = f'SELECT * FROM git_daily_status WHERE the_date = "{date}" AND member_name = {memberId}'
        self.cursor.execute(sql)
        self.cursor.fetchone()
        if self.cursor.rowcount <= 0:
            sql = 'INSERT INTO git_daily_status ' +\
                '(the_date, member_name, lines_added, lines_removed) ' +\
                f'VALUES ("{date}", {memberId}, {linesAdded}, {linesRemoved})'
        else:
            sql = 'UPDATE git_daily_status ' +\
                f'SET ' +\
                f'  lines_added = {linesAdded}, ' +\
                f'  lines_removed = {linesRemoved} ' +\
                f'WHERE the_date = "{date}" AND member_name = {memberId}'
        self.cursor.execute(sql)
        self.cnx.commit()

    def createRecords(self):
        date = startDate
        for _ in range(numOfDays):
            for team in range(len(teamNames)):
                for member in range(len(teamMemberNames[team])):
                    linesAdded = random.randrange(200) + 1
                    linesRemoved = random.randrange(50) + 1
                    self.writeSourceCodeRecord(date, teamMemberNames[team][member], linesAdded, linesRemoved)
            date += datetime.timedelta(days = 1)

class RecordGithub(RecordBase):
    def writePullRequestRecord(self, created_at, closed_at, pr_num, member, state):
        memberId = self.getScrumMemberId(member)

        sql = f'SELECT * FROM github_pull_requests WHERE pr_num = "{pr_num}"'
        self.cursor.execute(sql)
        self.cursor.fetchone()
        if self.cursor.rowcount <= 0:
            if state == 'open':
                sql = 'INSERT INTO github_pull_requests ' +\
                    '(created_at, closed_at, pr_num, member_name, state) ' +\
                    f'VALUES ("{created_at}", NULL, {pr_num}, {memberId}"{state}")'
            else:
                sql = 'INSERT INTO github_pull_requests ' +\
                    '(created_at, closed_at, pr_num, member_name, state) ' +\
                    f'VALUES ("{created_at}", "{closed_at}", {pr_num}, {memberId}, "{state}")'
        else:
            if state == 'open':
                sql = 'UPDATE github_pull_requests ' +\
                    f'SET created_at = "{created_at}", closed_at = NULL, state = "{state}" WHERE pr_num = {pr_num}'
            else:
                sql = 'UPDATE github_pull_requests ' +\
                    f'SET created_at = "{created_at}", closed_at = "{closed_at}", state = "{state}" WHERE pr_num = {pr_num}'
        self.cursor.execute(sql)
        self.cnx.commit()

    def createPRRecords(self):
        pr_num = 0
        for team in range(len(teamNames)):
            for member in range(len(teamMemberNames[team])):
                for _ in range(teamMemberPRs[team][member]):
                    created_at = startDate + datetime.timedelta(days = random.randrange(4))
                    flip = random.randrange(2)
                    state = 'open'
                    closed_at = None
                    if flip == 0:
                        state = 'closed'
                        closed_at = created_at + datetime.timedelta(hours = random.randrange(48) + 1)
                    self.writePullRequestRecord(created_at, closed_at, pr_num, teamMemberNames[team][member], teamNames[team], state)
                    pr_num += 1

    def createReviewRecords(self):
        # need to reset the github_review table each time call this function
        sql = f'SELECT * FROM github_pull_requests'
        self.cursor.execute(sql)
        prs = self.cursor.fetchall()
        for pr in prs:
            pr_num = pr[3]
            submitted_at = pr[1]
            random_review_count = random.randrange(5)
            for _ in range(random_review_count):
                teamId = random.randrange(2)
                memberId = random.randrange(len(teamMemberNames[teamId])) + 1
                submitted_at += datetime.timedelta(minutes=1)
                sql = 'INSERT INTO github_reviews ' +\
                        '(pr_num, member_name, submitted_at) ' +\
                        f'VALUES ({pr_num}, {memberId}, "{submitted_at}")'
                self.cursor.execute(sql)
                self.cnx.commit()
        return

class RecordSprint(RecordBase):
    def writeSprintRecord(self, start_date, end_date, sprint_id, ticket_count, completed_tickets, completed_story_points):
        sql = f'SELECT * FROM jira_sprints WHERE sprint_id = {sprint_id}'
        self.cursor.execute(sql)
        self.cursor.fetchone()
        if self.cursor.rowcount <= 0:
            sql = 'INSERT INTO jira_sprints ' +\
                '(start_date, end_date, sprint_id, ticket_count, completed_tickets, completed_story_points) ' +\
                f'VALUES ("{start_date}", "{end_date}", {sprint_id}, {ticket_count}, {completed_tickets}, {completed_story_points})'
        else:
            sql = 'UPDATE jira_sprints ' +\
                f'SET start_date = "{start_date}", start_date = "{end_date}", ticket_count = {ticket_count}, completed_tickets = {completed_tickets}, completed_story_points = {completed_story_points} WHERE sprint_id={sprint_id}'
        self.cursor.execute(sql)
        self.cnx.commit()

    def createSprints(self):
        date = startDate
        self.writeSprintRecord(date, date + datetime.timedelta(days = 6), 1531, 20, 17, 38)
        date += datetime.timedelta(days = 6)
        self.writeSprintRecord(date, date +datetime.timedelta(days = 6), 1532, 14, 14, 28)
        date += datetime.timedelta(days = 6)
        self.writeSprintRecord(date, date +datetime.timedelta(days = 6), 1533, 17, 13, 25)
        date += datetime.timedelta(days = 6)
        self.writeSprintRecord(date, date +datetime.timedelta(days = 6), 1534, 12, 12, 26)

    def writeMemberSprintRecord(self, member, sprint_id, completed_tickets, completed_story_points):
        member_name = self.getScrumMemberId(member)

        sql = f'SELECT * FROM jira_sprints_members WHERE sprint_id = {sprint_id} and member_name = {member_name}'
        self.cursor.execute(sql)
        self.cursor.fetchone()
        if self.cursor.rowcount <= 0:
            sql = 'INSERT INTO jira_sprints_members ' +\
                '(member_name, sprint_id, completed_tickets, completed_story_points) ' +\
                f'VALUES ({member_name}, {sprint_id}, {completed_tickets}, {completed_story_points})'
        else:
            sql = 'UPDATE jira_sprints_members ' +\
                f'SET completed_tickets = {completed_tickets}, completed_story_points = {completed_story_points} WHERE sprint_id = {sprint_id} and member_name = {member_name}'
        self.cursor.execute(sql)
        self.cnx.commit()

    def createMemberSprints(self):
        sprint_id = 1531
        for _ in range(4):
            for member in range(len(teamMemberNames[0])):
                completed_tickets = random.randrange(8) + 1
                completed_story_points = completed_tickets * (random.randrange(3) + 1)
                self.writeMemberSprintRecord(teamMemberNames[0][member], sprint_id, completed_tickets, completed_story_points)
            sprint_id += 1
        return

class RecordCurrentSprint(RecordBase):
    def writeCurrentSprintRecord(self, sprint_name, team, total_tickets, total_todo, total_inprogress, total_blocked, total_completed, days_remained):
        sql = f'SELECT * FROM current_sprint_team WHERE team = "{team}"'
        self.cursor.execute(sql)
        self.cursor.fetchone()
        if self.cursor.rowcount <= 0:
            sql = 'INSERT INTO current_sprint_team ' +\
                '(sprint_name, team, total_tickets, total_todo, total_inprogress, total_blocked, total_completed, days_remained) ' +\
                f'VALUES ("{sprint_name}", "{team}", "{total_tickets}", "{total_todo}", {total_inprogress}, {total_blocked}, {total_completed}, {days_remained})'
            self.cursor.execute(sql)
            self.cnx.commit()

    def createCurrentSprints(self):
        self.writeCurrentSprintRecord("sprint 23", teamNames[0], 20, 10, 2, 1, 7, 6)
        self.writeCurrentSprintRecord("sprint 23", teamNames[1], 15, 5, 5, 3, 2, 6)

try:
    cnx = mysql.connector.connect(user = 'grafana', password = 'grafana',
                                host = 'localhost',
                                database = databaseName)
    cursor = cnx.cursor()

    # write source code activities per team member
    #rec = RecordSourceCode(cnx, cursor)
    #rec.createRecords()

    #rec = RecordGithub(cnx, cursor)
    #rec.createPRRecords()
    #rec.createReviewRecords()

    # write sprint ticket and story activities per team
    rec = RecordSprint(cnx, cursor)
    rec.createSprints()
    rec.createMemberSprints()
except Exception as err:
    print(err)
finally:
    if cursor != None:
        cursor.close()
    if cnx != None:
        cnx.close()