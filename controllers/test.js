
app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    }

    jwt.sign({user}, 'secretkey', (err, token) => {
        res.json({
            token
        });
    });
})

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
      if(err) {
          res.sendStatus(403);
      }  else {
          res.json({
              message: 'Post created...',
              authData
          })
      }
    })
})



// authorization: bearer <access_token>

function verifyToken (req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();

    } else {
        res.sendStatus(403);
    }
}