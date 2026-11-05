module.exports = async (req, res) => {
  return res.json({ enabled: false, blockedCountries: [], allowedCountries: [] });
};
