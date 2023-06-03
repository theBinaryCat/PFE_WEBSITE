const dashboardContrats = async (req, res) => {
  const user = await req.user;
  console.log("the user name: ", user.name);
  res.render("dashboards/production.contrats.ejs", { name: user.name });
};

module.exports = {
  dashboardContrats,
};
