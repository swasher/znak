from invoke import task
from decouple import config

DATABASE_NAME = config('DATABASE_NAME', '')
DATABASE_USER = config('DATABASE_USER', '')
DATABASE_PASSWORD = config('DATABASE_PASSWORD', '')
DATABASE_HOST = config('DATABASE_HOST', '')
DATABASE_PORT = config('DATABASE_PORT', '')

DOCKER_CONTAINER = 'znak_container'
DOCKER_VOLUME = 'pg_znak'


"""
Run task with replaced underscore to dash, i.e
$ inv create-volume
See http://docs.pyinvoke.org/en/latest/concepts/namespaces.html#dashes-vs-underscores
"""


@task
def create_volume(c):
    c.run(f'docker volume create --name={ DOCKER_VOLUME }')


@task
def create_superuser(c):
    # STILL NOT WORKING
    # c.run("DJANGO_SUPERUSER_USERNAME=swasher DJANGO_SUPERUSER_PASSWORD=000111 python manage.py createsuperuser --noinput")
    # c.run("DJANGO_SUPERUSER_PASSWORD=000111 python manage.py createsuperuser --username swasher --email mr.swasher@gmail.com --noinput")
    # c.run("echo \"User.objects.create_superuser('swasher', '000111')\" | python manage.py shell_plus") # требует shell_plus
    pass



@task
def start_postgres(c):
    c.run(f'docker run \
            --rm \
            --name { DOCKER_CONTAINER } \
            --env POSTGRES_PASSWORD={ DATABASE_PASSWORD } \
            --publish { DATABASE_PORT }:5432 \
            --volume { DOCKER_VOLUME }:/var/lib/postgresql/data \
            postgres')

@task
def renew_db(c):
    try:
        c.run(f'docker stop { DOCKER_CONTAINER }')
    except:
        pass

    c.run(f'docker volume rm { DOCKER_VOLUME }')
    c.run(f'docker volume create --name={ DOCKER_VOLUME }')
    print('After that do start-postgres, manage migrate and create-superuser')


# how do cli help
# @task(help={'name': "Name of the person to say hi to."})
# def hi(name):
#     """Say hi to someone."""
#     print("Hi %s!" % name)

# rem echo "User.objects.create_superuser('swasher', '000111')" | python manage.py shell_plus
# set DJANGO_SUPERUSER_USERNAME=swasher
# set DJANGO_SUPERUSER_PASSWORD=000111
# python manage.py createsuperuser --email mr.swasher@gmail.com  --noinput