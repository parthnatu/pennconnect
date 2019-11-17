FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y apache2 
RUN apt-get install -y php 
RUN apt-get install -y php-dev 
RUN apt-get install -y php-mysql 
RUN apt-get install -y libapache2-mod-php 
RUN apt-get install -y php-curl 
RUN apt-get install -y php-json 
RUN apt-get install -y php-common 
RUN apt-get install -y php-mbstring 
RUN apt-get install -y composer
RUN apt-get install -y php-bcmath
RUN apt-get install -y openjdk-8-jdk-headless
RUN apt-get install -y wget
RUN wget -O - https://debian.neo4j.org/neotechnology.gpg.key | apt-key add -
RUN echo 'deb https://debian.neo4j.org/repo stable/' | tee -a /etc/apt/sources.list.d/neo4j.list
RUN apt-get update
RUN apt-get install -y neo4j=1:3.5.12
COPY ./neo4j.conf /etc/neo4j/neo4j.conf
COPY ./graph.db /var/lib/neo4j/data/databases/graph.db
RUN echo 'mysql-server mysql-server/root_password password PennConnect@123' | debconf-set-selections
RUN echo 'mysql-server mysql-server/root_password_again password PennConnect@123' | debconf-set-selections
RUN apt-get -y install mysql-server
RUN update-rc.d mysql defaults
COPY ./pennconnect_bkp.sql ./pennconnect_bkp.sql
RUN service mysql start && mysql -uroot -pPennConnect@123 -e "CREATE DATABASE pennconnect;"
RUN service mysql start && mysql -uroot -pPennConnect@123 pennconnect < pennconnect_bkp.sql
COPY ./apache2.conf /etc/apache2/apache2.conf
COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf
CMD /usr/bin/mysqld_safe&
CMD ["apachectl","-D","FOREGROUND"]
RUN a2enmod rewrite
EXPOSE 80
