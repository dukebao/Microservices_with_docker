const express = require('express');
const {MongoClient} = require('mongodb');
const PORT = 5000;

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const uri = "mongodb://root:password@mongo:27017/";
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

app.get("/:name", (req, res) => {
  client.connect((err, client) => {
    if (err) console.log(err)
    else {
      console.log(req.params.name);
      const data = client.db('bmi_mongo').collection("bmi_table");
      const query = { name: req.params.name };
      data.findOne(query).then(items => {
        res.render("view", {items})
      })
    }
  })
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
