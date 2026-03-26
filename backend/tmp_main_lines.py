from pathlib import Path
for i,line in enumerate(Path('app/main.py').read_text(encoding='utf-8').splitlines(),1):
    if 120 <= i <= 220:
        print(f"{i:04d}: {line}")
