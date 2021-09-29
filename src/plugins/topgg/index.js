const Topgg = require('@top-gg/sdk');
const topgg = new Topgg.Api(process.env.topggtoken);

// Posts statistics to Top.gg
setInterval(() => {
	topgg.postStats({
		serverCount: client.guilds.cache.size
	})
}, 1800000) // post every 30 minutes