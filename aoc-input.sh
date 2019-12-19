#!/bin/sh

error() {
    echo $1
    exit 1
}

[ $# -eq 1 ] || error "usage: aoc-input.sh DAY_NUMBER"
[ -f .aoc-session ] || error "[error] please put your session id in the file .aoc-session"

session=$(cat ./.aoc-session)

curl -s --cookie "session=$session" https://adventofcode.com/2019/day/$1/input > src/input/day$1.txt
echo "[day$1] src/input/day$1.txt"
cat src/input/day$1.txt