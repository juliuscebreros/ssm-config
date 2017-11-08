
const aws = require( 'aws-sdk' )

const ssm = new aws.SSM({apiVersion: '2014-11-06'})

module.exports = {
    getSSMValue: ( key, region = process.env.AWS_REGION ) => {
        const ssm = new aws.SSM({ apiVersion: '2014-11-06', region: region });
        return ssm.getParameter({
            Name: key
        } ).promise().then( ( res ) => {
            return res.Parameter.Value;
        } );
    }
}