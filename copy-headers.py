#!/usr/bin/env python
import re
from pathlib import Path


def copy_headers(src: Path, dest: Path):
    """Copy the headers from the source file (.ts) to the output file (.js)"""

    for file in src.glob("**/*.ts"):
        header = ""

        # Open `.ts` file and read its header
        with open(file) as f:
            while True:
                line = f.readline()
                if not line.startswith("//"):
                    break

                header += line

        # Build the header for the .js file in the build dir
        file_name = file.stem + ".js"
        dest_file = dest / file_name

        with open(dest_file, "r+") as f:
            content = f.read()

            # Remove header if present
            re.sub(r"^//.*$\n?", "", content, flags=re.MULTILINE)

            # Add new header
            f.seek(0)
            f.write(header + content)


if __name__ == "__main__":
    src = Path(__file__).resolve().parent / "src"
    dest = Path(__file__).resolve().parent / "build"

    copy_headers(src, dest)
