# SSM-CONFIG

Reads a json object and replaces all all-caps keys with the SSM key from the value

## Install

```
npm install --save ssm-config
```

## Usage
```
const ssmConfig = require( 'ssm-config' );

ssmConfig( {
    username: 'testUser',
    PASSWORD: 'param-store-key'
} ).then( ( result ) => {
    // result.username == 'testUser'
    // result.password == 'thevalueinssm'
} ); 
```


## AWS Config
- This module assumes that aws credentials are setup either in the ~/.aws path or as environment variables

