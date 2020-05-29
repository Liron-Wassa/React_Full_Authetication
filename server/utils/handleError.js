const handleError = (req, res, error) => {
    res.status(500).json({error: error});
};

module.exports.handleError = handleError;