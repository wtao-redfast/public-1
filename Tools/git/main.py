from input import *
from git import *
from matplot import *
import os
import matplotlib
import matplotlib.pyplot as plt

def plotOnePerson7DaysGitActivities(axis, name, startDate):
    numOfDays = 7
    output = queryDailyActivity(name, startDate, numOfDays)
    summary = list(map(lambda tuple: tuple[0] + tuple[1], output)) # total change = added + removed
    breakdown = []
    breakdown.append(list(map(lambda tuple: tuple[0], output))) # added
    breakdown.append(list(map(lambda tuple: tuple[1], output))) # removed

    xValue = []
    day0 = startDate
    for _ in range(numOfDays):
        xValue.append(day0.strftime("%m/%d"))
        day0 += datetime.timedelta(days = 1)

    plotSinglebar(axis[0], xValue, summary, title = name + " - daily activity summary", yLabel = "lines changed")
    plotMultibar(axis[1], xValue, breakdown, ["Added", "Removed"], title = name + " - daily activity breakdown", yLabel = "lines changed")


def main():
    names = acceptUserNames()
    dateRange = acceptTimeRange()
    os.chdir("/Users/wenweitao/Documents/brig")
    fig, ax = plt.subplots(len(names), 2)
    for index in range(len(names)):
        plotOnePerson7DaysGitActivities(ax[index], names[index], dateRange[0])
    fig.tight_layout()
    plt.show()


main()