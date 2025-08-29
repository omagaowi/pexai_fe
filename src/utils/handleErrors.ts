const handleError = ( error: any) => {
  if (error.response) {
    return error.response.data || 'Something went wrong!'
  } else if (error.request) {
    return 'Unable to reach server'
  } else {
   return 'Please check your connection'
  }
};

export default handleError;
