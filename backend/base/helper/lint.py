""" Pylint file to check code quality... """

import contextlib
import os
import subprocess

def run_pylint(app_dir):
    """Function to run the Pylint Script."""

    # Set the directory where your Flask app resides
    app_dir = os.path.abspath(os.path.dirname(app_dir))
    

    # Ignore some files or directories from linting, if provided
    ignore_paths = []

    # Add paths to ignored directories or files here, if necessary

    if ignored_paths := []:
        ignore_paths.extend(os.path.join(app_dir, path) for path in ignored_paths)

    # Command to run Pylint
    command = ["pylint", "--rcfile=.pylintrc", "--ignore", ",".join(ignore_paths), app_dir]

    # Run Pylint and capture the output
    with contextlib.suppress(subprocess.CalledProcessError):
        subprocess.run(command, check=True)