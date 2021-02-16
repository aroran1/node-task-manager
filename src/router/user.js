const express = require('express');
const router = new express.Router();

router.get('/test', (req, res) => {
  res.send('Test router is set');
});

module.exports = router;