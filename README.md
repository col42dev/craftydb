# craftydb
backend for crafty app

# Starting crafty db app and dependencies on a EC2 Linux instance.

    $ uname -a
    Linux  x86_64 x86_64 x86_64 GNU/Linux
    
# install mongodb instance for 64 bit linux

[Tutorial](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-linux/)

    $ cd html
    $ curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.0.4.tgz
    $ tar -zxvf mongodb-linux-x86_64-3.0.4.tgz
    
    $ echo $PATH
    /usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin:/opt/aws/bin:/home/ec2-user/bin
    
    $ export PATH=$PATH:/home/ec2-user/nginx/html/mongodb/mongodb-linux-x86_64-3.0.4/bin
    
    $ echo $PATH
    /usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin:/opt/aws/bin:/home/ec2-user/bin:/home/ec2-user/nginx/html/mongodb/mongodb-linux-x86_64-3.0.4/bin
    
    


**start mongodb instance**

Fork mongod instance so that it is not parented to current shell instance.

    $bin/mongod --httpinterface --rest --fork  --logpath ~/log/mongodb.log
    
    about to fork child process, waiting until server is ready for connections.
    forked process: 6754
    child process started successfully, parent exiting
    
    $ ps -A
    6717 ?        00:00:05 mongod

    $bin/mongo shell
    
    MongoDB shell version: 3.0.4
    connecting to: shell
    
    > show databases
    local     0.078GB
    redshift  0.203GB
    test      0.203GB
    
    >use test
    
    > show collections
    accounts
    system.indexes
    test
    timers
    
    >quit()
    
    
**start nodejs instance**

Start instance in background 'no hang-up' 

    $nohup node craftydbapp.js >/dev/null 2>&1 &
    [1] 6776
    
    $ps -A
    6896 pts/0    00:00:02 node

View http://ec2-54-201-237-107.us-west-2.compute.amazonaws.com:8080/ 

    [{"_id":"55c1264c73d55f2b61954c6e","name":"4 weeks","duration":2419200,"clientIntervalId":0,"remaining":728707,"starttime":1438721612,"expired":false}]
    
    
