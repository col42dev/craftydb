# craftydb
backend for crafty app

# Starting crafty db app and dependencies on a EC2 Linux instance.

    $ uname -a
    Linux  x86_64 x86_64 x86_64 GNU/Linux


**start mongodb instance**

    bin/mongod --httpinterface --rest --fork  --logpath ~/log/mongodb.log
    bin/mongo shell
    
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

    nohup node craftydbapp.js >/dev/null 2>&1 &

View http://ec2-54-201-237-107.us-west-2.compute.amazonaws.com:8080/ 

    [{"_id":"55c1264c73d55f2b61954c6e","name":"4 weeks","duration":2419200,"clientIntervalId":0,"remaining":728707,"starttime":1438721612,"expired":false}]
    
    
