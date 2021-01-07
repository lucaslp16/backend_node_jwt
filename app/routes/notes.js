var express = require('express');
var router = express.Router();
const Note = require ('../models/note');
const withAuth = require('../middlewares/auth');


//Create Notes
router.post('/', withAuth, async (req,res) =>{
    const { title, body } = req.body;
    
    try {
        let note = new Note ({ title: title, body: body, author: req.user._id});
        await note.save();
            res.status(200).json(note);
    } catch (error) {
        res.status(500).json({error: 'Problem to create a new note'});
    }

});





// Show notes /:id
router.get('/:id', withAuth, async(req,res)=>{
    try {
        const {id} = req.params;
        let note = await Note.findById(id);
        if(isOwner(req.user, note))
            res.json(note)
        else
            res.status(403).json({error: 'Permission denied'});
    } catch (error) {
        res.status(500).json({error: 'Problem to get a new note'});
    }
})

//Show all notes
router.get('/',withAuth, async(req,res)=>{
    try {
        let notes = await Note.find({author: req.user._id});
        res.json(notes);
    } catch (error) {
        res.json({error: error}).status(500);
    }
});

//Modify note by ID
router.put('/:id', withAuth, async(req,res)=>{
    const {title, body} = req.body;
    const { id } = req.params;

    try {
        let note = await Note.findById(id);
            if(isOwner (req.user, note)){
            let note = await Note.findByIdAndUpdate(id,
                { $set: {title: title, body: body}},
                { upsert: true, 'new': true}
                );

                res.json(note);
            }else{
                res.status(403).json({error: 'Permission denied'});
            }
    
    } catch (error) {
        res.status(500).json({error: 'Problem to update a note'});
    }
});

//Delete note by ID
router.delete('/:id', withAuth, async(req,res)=>{
    const {id} = req.params;
    try {
        let note = await Note.findById(id); 
        if(isOwner(req.user, note)){
            await note.delete();
            res.json({message: 'OK'}).status(204);
        }else{
            res.status(403).json({error: 'Permission denied'});
        }
        
    } catch (error) {
        res.status(500).json({error: 'Problem to delete a note'});
    }
})

//Check if the note belongs to the user
const isOwner = (user, note) =>{
    if(JSON.stringify(user._id) == JSON.stringify(note.author._id))
        return true;
    else
        return false;
}


module.exports = router;
