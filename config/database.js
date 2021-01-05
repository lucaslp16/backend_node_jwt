const mongoose = require ('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/javascriptNode',{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log('Connection sucessful')
}).catch((err)=>{
    console.log (err)
})