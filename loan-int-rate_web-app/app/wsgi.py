import click
from app.app import app, initialize_db

@app.cli.command("init", help="Creates and initializes the database")
def initialize():
  initialize_db()
  print('database initialized')

if __name__ == "__main__":
    app.run()