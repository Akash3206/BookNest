// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/booknest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err)); 

const JWT_SECRET = '025537664d319de832ddacedb2b3a166b874fa98350465ae6ba844c0c82c1508';
const PORT = 5000; 