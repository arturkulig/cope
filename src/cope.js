import * as coper from './coper';

// - - - - - - - - - - - - - - - - - - - - - - -

function cope(startingFunction) {
    return cope.clone(null)(startingFunction);
}

cope.clone = coper.clone;


export default cope;
