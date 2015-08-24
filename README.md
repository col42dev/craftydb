# craftydb

craftydb is the server implementation for [crafty](https://github.com/col42dev/crafty) [MEAN](http://mean.io/#!/) stack app.
It is a nodejs app with REST API which connects to a mongojs instance.
This is the setup for running from Linux EC2 or OS X.

**Starting crafty db app and dependencies on a EC2 Linux / OS X**

    $ uname -a
    Linux  x86_64 x86_64 x86_64 GNU/Linux
    
    $ uname -a
    Darwin 14.5.0 Darwin Kernel Version 14.5.0; root:xnu-2782.40.9~1/RELEASE_X86_64 x86_64
    
**update npm**

    $ npm -v
    1.3.4
    
    $ sudo npm install npm -g
    
    $ npm -v
    2.13.0
    
**[update nodejs](http://stackoverflow.com/questions/8191459/how-to-update-node-js)**

    $ sudo npm cache clean -f
    npm WARN using --force I sure hope you know what you are doing.


    $ sudo npm install -g n
    /usr/local/bin/n -> /usr/local/lib/node_modules/n/bin/n
    n@1.3.0 /usr/local/lib/node_modules/n
    
    $ sudo n stable
    install : node-v0.12.7
       mkdir : /usr/local/n/versions/node/0.12.7
       fetch : https://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz
    installed : v0.12.7
    
**install local package dependancies**

    $ npm install express
    $ npm install body-parser
    $ npm install mongojs

**view installed packages**

    $ npm list  --depth=0
    /home/ec2-user/nginx/html/craftydb
    ├── body-parser@1.13.2
    ├── express@4.13.1
    ├── mongojs@1.0.2
    └── mongoose@4.1.0
    
    $ npm list -g --depth=0
    /usr/local/lib
    ├── express@4.13.1
    ├── mongojs@1.0.2
    ├── n@1.3.0
    ├── npm@2.11.3
    └── socket.io@0.9.16


**install mongodb instance for 64 bit linux**

[Tutorial](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-linux/)

    $ cd html
    $ curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.0.4.tgz
    $ tar -zxvf mongodb-linux-x86_64-3.0.4.tgz
    
    $ echo $PATH
    /usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin:/opt/aws/bin:/home/ec2-user/bin
    
    $ export PATH=$PATH:/home/ec2-user/nginx/html/mongodb/mongodb-linux-x86_64-3.0.4/bin
    
    $ echo $PATH
    /usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin:/opt/aws/bin:/home/ec2-user/bin:/home/ec2-user/nginx/html/mongodb/mongodb-linux-x86_64-3.0.4/bin
    


**start mongodb instance (linux)**

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
    
**start mongodb instance (OS X)**

    $ cd /Users/colinmoore/dev/mongodb-osx-x86_64-3.0.4/bin
    $ mongod --dbpath /Users/colinmoore/data --httpinterface --rest
    
open shell

    $ mongodb-osx-x86_64-3.0.4/bin/mongo
    MongoDB shell version: 3.0.4
    connecting to: test
    
view instance from browser

    $ http://localhost:28017/
 
 
**install nodejs instance (linux)**

    $ sudo npm install -g mongojs

**start nodejs instance (linux)**

Start instance in background 'no hang-up' 

    $nohup node craftydbapp.js >/dev/null 2>&1 &
    [1] 6776
    
    $ps -A
    6896 pts/0    00:00:02 node
    
    
**populate db from command line**

    curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"tag":"noob","score":43,"date":"now"}' http://localhost:8080/accounts


    curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"tag":"noob","score":43,"date":"now"}' http://ec2-54-201-237-107.us-west-2.compute.amazonaws.com:8080/accounts

**view db content from browser**

View http://ec2-54-201-237-107.us-west-2.compute.amazonaws.com:8080/ 

    [{"_id":"55c1264c73d55f2b61954c6e","name":"4 weeks","duration":2419200,"clientIntervalId":0,"remaining":728707,"starttime":1438721612,"expired":false}]
    
    
