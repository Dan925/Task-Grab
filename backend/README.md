# Task Grab Backend

# Setup:
- Add project dependencies: ` pip install -r requirements.txt `
- To run the project: ` python manage.py runserver `

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


