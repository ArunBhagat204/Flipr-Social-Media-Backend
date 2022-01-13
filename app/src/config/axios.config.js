const props = (authKey) => {
  return {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      authorization: `bearer ${authKey}`,
    },
  };
};

module.exports = { props };
