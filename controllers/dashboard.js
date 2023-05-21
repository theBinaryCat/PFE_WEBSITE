const dashboard = async (req, res) => {
    const user = await req.user
    console.log('the user name: ',user.name)
    res.render('index.ejs', { name: user.name })
} 

module.exports={dashboard}
