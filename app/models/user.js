const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');

//Created user
let userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true, required: true},
    password: {type:String, required: true},
    created_at: { type: Date, default: Date.now},
    update_at : { type: Date, default:Date.now}
});

userSchema.pre('save', function(next){
    if(this.isNew || this.isModified('password')){
        const document = this;
        bcrypt.hash(this.password, 10,
            (err,hashedPassworld) =>{
                if(err)
                    next(err)
                else {
                    this.password = hashedPassworld;
                    next();
                }

            }    
        )
    }
});

userSchema.methods.isCorrectPassword = function (password, callback){
    bcrypt.compare(password, this.password, function(err, same){
        if(err)
            callback(err);
        else
            callback(err,same)
    })
}


module.exports = mongoose.model ('User', userSchema); 