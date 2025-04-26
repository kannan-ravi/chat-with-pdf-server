const getHomePage = (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
};

export default { getHomePage };
