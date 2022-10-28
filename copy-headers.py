#!/usr/bin/env python
import re
from pathlib import Path

def copy_headers(src: Path, build: Path):
    """"Copy the headers from the source file to the output file"""

    for file in src.glob("**/*.ts"):
        header = ""

        # Open .ts file and read header
        with open(file) as f:
            while True:
                line = f.readline()
                if line.startswith('//'):
                    header += line
                else:
                    break

        # Build the header for the .js file in the build dir
        file_name = file.stem + ".js"
        build_file = build / file_name

        with open(build_file, "r+") as f:
            content = f.read()

            # Remove header if present
            re.sub(r"^//.*$\n?", '', content, flags=re.MULTILINE)

            # Add new header
            f.seek(0)
            f.write(header + content)


if __name__ == "__main__":
    src = Path(__file__).resolve().parent / "src"
    build = Path(__file__).resolve().parent / "build"

    copy_headers(src, build)