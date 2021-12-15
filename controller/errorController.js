const AppError = require('./../utils/appError')

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const handleDuplicateError = (err) => {
  const message = `Duplicate error.`
  return new AppError(message, 400)
}

const errorProd = (err, res) => {
  if (err.isOperational) {
    //Operational error, error umum yg kita bikin sendiri
    console.log('ERROR : ', err)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    //Error Programming
    console.error('ERROR : ', err)
    res.status(500).json({
      status: 'Error',
      message: 'Something when wrong',
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  let error = { ...err }

  // if (err instanceof mongoose.Error.CastError) error = handleCastError(error)
  if (error.code === 11000) error = handleDuplicateError(error)
  errorProd(error, res)
}
