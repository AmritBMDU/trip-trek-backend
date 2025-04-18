const express = require('express');
const { addLead, getLead, putLead, deleteLead } = require('../controllers/lead.controller');
const router = express.Router();

router.post('/add-lead',(req,res)=>{
    addLead(req,res);
});

router.get('/get-lead',(req,res)=>{
    getLead(req,res);
});

router.put('/put-lead/:id',(req,res)=>{
    putLead(req,res);
});

router.delete('/delete-lead/:id',(req,res)=>{
    deleteLead(req,res)
});
module.exports = router;