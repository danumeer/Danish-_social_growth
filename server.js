const express=require('express');
const session=require('express-session');
const crypto=require('crypto');
const app=express();
const PORT=process.env.PORT||3000;
const BASE_URL=process.env.BASE_URL;
const META_APP_ID=process.env.META_APP_ID;
const META_APP_SECRET=process.env.META_APP_SECRET;

app.use(express.urlencoded({extended:true}));
app.use(session({secret:process.env.SESSION_SECRET||crypto.randomBytes(32).toString('hex'),resave:false,saveUninitialized:false,cookie:{httpOnly:true,secure:process.env.NODE_ENV==='production'}}));
app.use(express.static(__dirname));

function oauthReady(){return BASE_URL&&META_APP_ID&&META_APP_SECRET}
function startOAuth(req,res){
  if(!oauthReady()) return res.status(503).send('<h2>Meta connection is not configured yet.</h2><p>Set BASE_URL, META_APP_ID and META_APP_SECRET on the server, then try again.</p>');
  const state=crypto.randomBytes(24).toString('hex'); req.session.metaState=state;
  const redirect=encodeURIComponent(`${BASE_URL}/auth/meta/callback`);
  const scope=encodeURIComponent('public_profile,email');
  const url=`https://www.facebook.com/v24.0/dialog/oauth?client_id=${encodeURIComponent(META_APP_ID)}&redirect_uri=${redirect}&state=${state}&scope=${scope}`;
  res.redirect(url);
}
app.get('/auth/instagram',startOAuth);
app.get('/auth/facebook',startOAuth);

app.get('/auth/meta/callback',async(req,res)=>{
  if(!oauthReady()) return res.status(503).send('Meta OAuth is not configured.');
  if(!req.query.code||req.query.state!==req.session.metaState) return res.status(400).send('Invalid OAuth state or missing code.');
  // Token exchange must be performed server-side with META_APP_SECRET.
  // Production implementation should call Meta's token endpoint here and store tokens encrypted.
  res.send('<h2>Meta authorization received.</h2><p>The server is ready for the secure token-exchange step.</p>');
});
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));