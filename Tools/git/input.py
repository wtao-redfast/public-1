import time
import datetime

def acceptUserNames():
    names = input("Please git usernames (e.g. joe, jol): ")
    nameCollection = names.split(",")
    #print(nameCollection)
    return nameCollection


def acceptTimeRange():
    def captureTime(prompt):
        timePos = input(prompt)
        return datetime.datetime.strptime(timePos, "%m/%d/%Y")

    step = 0
    startTime = datetime.datetime.now()
    endTime = datetime.datetime.now()
    while (True):             
        try:
            if step == 0:
                startTime = captureTime("Please query start date (e.g. MM/DD/YYYY): ")
            step = 1
            endTime = captureTime("Please query end date (e.g. MM/DD/YYYY): ")
        except:
            print("failed to convert to a date ")
            continue
        if startTime >= endTime:
            print("start date must be earlier than end date")
            step = 0
            continue
        break

    #print("query datetime range: " + startTime + "-" + endTime)
    return (startTime, endTime)
