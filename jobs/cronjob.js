const CronJob = require('cron').CronJob;
const Post = require('../models/post');

const job = new CronJob('* */4 * * * *', async () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - 5);//setira vreme na d koe sto e pomalo za 5 minuti od vremeto koesto go zima so getmiinutes- sega vo momenttov
  const posts = await Post.find({createdAt: {$gte: d}});
  //gi vadi site postovi od baza koi se kreirani vo prethodnite 5 minuti $gte go definira ova pogledni za mongo $gte

  /** Send mail */

  console.log(posts);
});

job.start();