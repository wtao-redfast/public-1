import subprocess
import datetime

def parse_int(s, base = 10, val = None):
 if s.isdigit():
  return int(s, base)
 else:
  return val

def queryActivity(useName, startDate, endDate):
    git = "git log " + \
        "--author=\"" + useName + "\" " + \
        "--since=\""+ startDate.strftime("%m/%d/%Y") + "\" " + \
        "--before=\"" + endDate.strftime("%m/%d/%Y") + "\" " + \
        "--numstat " + \
        "--pretty=tformat:" 
    awk = "awk '{ add += $1; subs += $2; } END { printf \"%s,%s\", add, subs }'"
    out = subprocess.Popen(git + "|" + awk, stdin = subprocess.PIPE, stdout = subprocess.PIPE, shell = True, text = True).stdout.read()
    components = out.split(",")
    return (parse_int(components[0], val = 0), parse_int(components[1], val = 0))


def queryDailyActivity(useName, startDate, numOfDays):
    results = []
    day0 = startDate
    for _ in range(numOfDays):
        daily = queryActivity(useName, day0, day0 + datetime.timedelta(days = 1))
        results.append(daily)
        day0 += datetime.timedelta(days = 1)
    return results