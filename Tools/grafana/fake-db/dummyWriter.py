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
numOfDays = 14
startDate = datetime.datetime(2020, 12, 12) 

class RecordBase:
    def __init__(self, connetcor, cursor):
        self.cnx = connetcor
        self.cursor = cursor

class RecordSourceCode(RecordBase):
    def writeSourceCodeRecord(self, date, member, team, linesAdded, linesRemoved):
        sql = f'SELECT * FROM daily_status WHERE the_date = "{date}" AND member_name = "{member}"'
        self.cursor.execute(sql)
        self.cursor.fetchone()
        if self.cursor.rowcount <= 0:
            sql = 'INSERT INTO daily_status ' +\
                '(the_date, member_name, team, lines_added, lines_removed) ' +\
                f'VALUES ("{date}", "{member}", "{team}", {linesAdded}, {linesRemoved})'
        else:
            sql = 'UPDATE daily_status ' +\
                f'SET ' +\
                f'  lines_added = {linesAdded}, ' +\
                f'  lines_removed = {linesRemoved} ' +\
                f'WHERE the_date = "{date}" AND member_name = "{member}"'
        self.cursor.execute(sql)
        self.cnx.commit()

    def createRecords(self):
        date = startDate
        for _ in range(numOfDays):
            for team in range(len(teamNames)):
                for member in range(len(teamMemberNames[team])):
                    linesAdded = int(random.random() * 200)
                    linesRemoved = int(random.random() * 200)
                    self.writeSourceCodeRecord(date, teamMemberNames[team][member], teamNames[team], linesAdded, linesRemoved)
            date += datetime.timedelta(days = 1)

class RecordSprint(RecordBase):
    def writeSprintRecord(self, date, name, team, totalTickets, totalStoryPotins, completedTickets, completedStoryPoints):
        sql = f'SELECT * FROM sprint_team WHERE start_date = "{date}" AND team = "{team}"'
        self.cursor.execute(sql)
        self.cursor.fetchone()
        if self.cursor.rowcount <= 0:
            sql = 'INSERT INTO sprint_team ' +\
                '(start_date, name, team, total_tickets, total_storypoints, completed_tickets, completed_storypoints) ' +\
                f'VALUES ("{date}", "{name}", "{team}", {totalTickets}, {totalStoryPotins}, {completedTickets}, {completedStoryPoints})'
            self.cursor.execute(sql)
            self.cnx.commit()

    def createTeamSprints(self):
        date = startDate
        self.writeSprintRecord(date, "sprint 21", teamNames[0], 23, 69, 18, 54)
        self.writeSprintRecord(date, "sprint 21", teamNames[1], 18, 54, 10, 30)
        date += datetime.timedelta(days = 7)
        self.writeSprintRecord(date, "sprint 22", teamNames[0], 20, 60, 18, 54)
        self.writeSprintRecord(date, "sprint 22", teamNames[1], 15, 45, 15, 45)

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
    rec = RecordSourceCode(cnx, cursor)
    rec.createRecords()

    # write sprint ticket and story activities per team
    rec = RecordSprint(cnx, cursor)
    rec.createTeamSprints()

    # write current sprint activities per team
    rec = RecordCurrentSprint(cnx, cursor)
    rec.createCurrentSprints()
except Exception as err:
    print(err)
finally:
    if cursor != None:
        cursor.close()
    if cnx != None:
        cnx.close()