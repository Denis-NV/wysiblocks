FROM mongo:4.2.6-bionic

ADD create_users.sh /docker-entrypoint-initdb.d/