module.exports = (err, req, res, next) => {
  console.error('❌ SERVER ERROR:', err);
  res.status(500).json({
    message: err.message || 'Lỗi hệ thống!'
  });
};