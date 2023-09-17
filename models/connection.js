const mongoose = require('mongoose')

//Connet to MongoDB
<<<<<<< HEAD
mongoose.connect('mongodb+srv://viv1kk:vivek%4015@veggies.epfqdwu.mongodb.net/?retryWrites=true&w=majority', {
=======
mongoose.connect('mongodb://127.0.0.1:27017/Veggies', {
>>>>>>> fc8aee94594ed3e5f2c5a6de6e1ec27f299b656e
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
});


module.exports = mongoose;