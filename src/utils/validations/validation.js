const validationPassword = (password) => {
    const response =
      /^(?=.*[a-z])(?=.*[0-9]).{5,}$/;
    return response.test(String(password));
  };
  
module.exports = { validationPassword };
  