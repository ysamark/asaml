export const internalServerErrorHandler = (response) => {
  // log(error)

  response
    .status(500)
    .json({
      error: 'Internal server error',
      message: 'Sorry! Something went wrong'
    })
    .end()
}
