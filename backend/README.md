# Task Grab Backend

# Setup:
- Install project dependencies: ` pip install -r requirements.txt `
- Fill `.env.sample` file and rename file to `.env`

# Requirements
- Python 3.8.11
- pip 21.3.1
- Postgres 13.1.3

# DB migration django cmds:
- create a db backup excluding `contenttypes` because that stores model relationships and that could generate an error
`python manage.py dumpdata --indent 4 > db.json`
-- Extra options if we use auto generated id fields: `--natural-primary --natural-foreign -e contenttypes -e auth.permission`
- clear data from db:
`python manage.py flush`
- sync models to db
 `python manage.py migrate --run-syncdb` 
- load db data
`python manage.py loaddata db.json`


