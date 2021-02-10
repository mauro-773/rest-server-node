const errorResponse = (res, error) => {
   return res.status(500).json({
      ok: false,
      error,
   });
};

module.exports = { errorResponse };
