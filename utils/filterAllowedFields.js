const filterAllowedFields = (data, allowedFields, userRole = null) => {

  if (userRole === "admin") {
    return data;
  }
  
  const filtered = {};

  Object.keys(data).forEach((key) => {
    if (allowedFields.includes(key)) {
      filtered[key] = data[key];
    }
  });

  return filtered;
};

module.exports = {filterAllowedFields};