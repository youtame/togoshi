import json
from collections import defaultdict

# JSONファイル読み込み
with open("TrainTimetable.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# train_nu ごとに calendar を集める
train_calendar_map = defaultdict(list)

for item in data:
    train_nu = item.get("train_nu")
    calendar = item.get("calendar")
    if train_nu and calendar:
        train_calendar_map[train_nu].append(calendar)

# 重複している train_nu だけ表示
for train_nu, calendars in train_calendar_map.items():
    if len(calendars) > 1:
        print(f"train_nu: {train_nu}")
        for cal in calendars:
            print(f"  calendar: {cal}")

