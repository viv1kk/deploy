const mongoose = require('mongoose')

//Connet to MongoDB
mongoose.connect('mongodb+srv://viv1kk:vivek%4015@veggies.epfqdwu.mongodb.net/?retryWrites=true&w=majority', {

mongoose.connect('mongodb://127.0.0.1:27017/Veggies', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
});


module.exports = mongoose;