const express = require('express');
const { addLead, getLead } = require('../controllers/lead.controller');
const router = express.Router();

router.post('/add-lead',(req,res)=>{
    addLead(req,res);
});

router.get('/get-lead',(req,res)=>{
    getLead(req,res);
});

module.exports = router;