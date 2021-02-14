# git commit query

## Commits overview
`git whatchanged --since="<start date, e.g. 2 weeks ago>" --author="<author name>"`

## Calculate changed line numbers of commits
`git log --author="<author name>" --since="<start date>" --numstat --pretty=tformat: | awk '{ add += $1; subs += $2; } END { printf "added lines: %s, removed lines: %s\n", add, subs }'`
