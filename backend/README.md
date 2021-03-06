# Task Grab Backend

# Setup:
- Install project dependencies: ` pip install -r requirements.txt `
- Fill `.env.sample` file and rename file to `.env`

# Data migration with django fixtures cmds:
- create a db backup excluding `contenttypes` because that stores model relationships and that could generate an error
`python manage.py dumpdata --indent 4 > db.json`
-- Extra options if we use auto generated id fields: `--natural-primary --natural-foreign -e contenttypes -e auth.permission`
- clear data from db:
`python manage.py flush`
- sync models to db
 `python manage.py migrate --run-syncdb` 
- load db data
`python manage.py loaddata db.json`
- [How to provide initial data for models](https://docs.djangoproject.com/en/4.0/howto/initial-data/)
# Data migration from postgres backup
1. `pg_dump -Ft <backupDb_name> > backup.tar`
2. Drop and recreate old database
3. `pg_restore -d <targetDB_name> backup.tar`
