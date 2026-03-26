from pathlib import Path
for i,line in enumerate(Path('app/services.py').read_text().splitlines(),1):
    if i <= 250:
        print(f"{i:04d}: {line}")
