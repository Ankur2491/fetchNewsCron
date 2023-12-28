const cheerio =  require('cheerio');
const axios = require('axios')
const redis = require('redis');
let timeout = Date.now();
newsObj = {"news":[]}
mainData = {"status": "ok","articles":[]}
fetchingData = false;
var client = redis.createClient({
    socket:{
        host:"redis-11422.c62.us-east-1-4.ec2.cloud.redislabs.com",
        port: 11422
    }
    ,password:"AFahzbIs3wTxs0VMPnvTqkuqyoZOWXwV"
  });
async function loadWorld() {
    let res = await axios.get(`http://feeds.bbci.co.uk/news/world/rss.xml`);
    let list = [];
    let html = res.data;
    const $ = cheerio.load(html,{xmlMode:true});
    $('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        let obj = {'source': 'BBC', 'title': title+'(source:BBC)', 'urlToImage': `https://news.bbcimg.co.uk/nol/shared/img/bbc_news_120x60.gif`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })
    
    
    let nyRes = await axios.get(`https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml`);
    let nyHtml = nyRes.data;
    const ny$ = cheerio.load(nyHtml, {xmlMode:true});
    ny$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        let obj = {'source': 'NY Times', 'title': title+'(source:NY Times)', 'urlToImage': `https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let alRes = await axios.get(`https://www.aljazeera.com/xml/rss/all.xml`);
    let alHtml = alRes.data;
    const al$ = cheerio.load(alHtml, {xmlMode:true});
    al$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        let obj = {'source': 'Al Jazeera', 'title': title+'(source:Al Jazeera)', 'urlToImage': `https://www.aljazeera.com/images/logo_aje.png`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })
    
    let n18Res = await axios.get(`https://www.news18.com/rss/world.xml`);
    let n18Html = n18Res.data;
    const n18$ = cheerio.load(n18Html, {xmlMode:true});
    n18$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'News18', 'title': title+'(source:News18)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })


    let ndRes = await axios.get(`http://feeds.feedburner.com/ndtvnews-world-news`);
    let ndHtml = ndRes.data;
    const nd$ = cheerio.load(ndHtml, {xmlMode:true});
    nd$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'NDTV', 'title': title+'(source:NDTV)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })


    list.sort((a,b)=> {
        let d1 = Date.parse(a.publishedAt);
        let d2 = Date.parse(b.publishedAt);
        return d2 - d1;
    })
    // let x = {'news': [{'articles': list}]}
    mainData['articles'] = list;
    newsObj['news'].push(mainData);
    mainData = {"status": "ok","articles":[]}
    console.log("World news done!!");
    // saveToDb();
    await loadIndia();
}

async function loadIndia() {
    let list = [];
    let ndRes = await axios.get(`http://feeds.feedburner.com/ndtvnews-india-news`);
    let ndHtml = ndRes.data;
    const $ = cheerio.load(ndHtml, {xmlMode:true});
    $('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'NDTV', 'title': title+'(source:NDTV)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })


    let zeeRes = await axios.get(`https://zeenews.india.com/rss/india-national-news.xml`);
    let zeeHtml = zeeRes.data;
    const zee$ = cheerio.load(zeeHtml, {xmlMode:true});
    zee$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubdate').text();
        const link = $(element).children('link').text();
        let obj = {'source': 'ZeeNews', 'title': title+'(source:ZeeNews)', 'urlToImage': `https://english.cdn.zeenews.com/images/logo/zeenewslogo_nav.png`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })


    let toiRes = await axios.get(`https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms`);
    let toiHtml = toiRes.data;
    const toi$ = cheerio.load(toiHtml, {xmlMode:true});
    toi$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = ``;
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        let imageUrl;
        $(element).find('enclosure').each((i, e)=>{
            imageUrl = $(e).attr('url');
        });
        let obj = {'source': 'TOI', 'title': title+'(source:TOI)', 'urlToImage': `${imageUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let hinduRes = await axios.get(`https://www.thehindu.com/news/national/feeder/default.rss`);
    let hinduHtml = hinduRes.data;
    const hindu$ = cheerio.load(hinduHtml, {xmlMode:true});
    hindu$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        let obj = {'source': 'TheHindu', 'title': title+'(source:TheHindu)', 'urlToImage': `https://www.thehindu.com/theme/images/th-online/logo.png`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let dnaRes = await axios.get(`https://www.dnaindia.com/feeds/india.xml`);
    let dnaHtml = dnaRes.data;
    const dna$ = cheerio.load(dnaHtml, {xmlMode:true});
    dna$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        let imageUrl;
        $(element).find('enclosure').each((i, e)=>{
            imageUrl = $(e).attr('url');
        });
        let obj = {'source': 'DNA', 'title': title+'(source:DNA)', 'urlToImage': `${imageUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let htRes = await axios.get(`https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml`);
    let htHtml = htRes.data;
    const ht$ = cheerio.load(htHtml, {xmlMode:true});
    ht$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'HindustanTimes', 'title': title+'(source:HindustanTimes)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })


    let news18Res = await axios.get(`https://www.news18.com/commonfeeds/v1/eng/rss/india.xml`);
    let news18Html = news18Res.data;
    const news18$ = cheerio.load(news18Html, {xmlMode:true});
    news18$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'News18', 'title': title+'(source:News18)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })


    let fpRes = await axios.get(`https://www.firstpost.com/rss/india.xml`);
    let fpHtml = fpRes.data;
    const fp$ = cheerio.load(fpHtml, {xmlMode:true});
    fp$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'FirstPost', 'title': title+'(source:FirstPost)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    list.sort((a,b)=> {
        let d1 = Date.parse(a.publishedAt);
        let d2 = Date.parse(b.publishedAt);
        return d2 - d1;
    })
    mainData['articles'] = list;
    newsObj['news'].push(mainData);
    mainData = {"status": "ok","articles":[]}
    console.log("India news done!!");
    await loadBusiness();
}
async function loadBusiness() {
    let list = [];
    let blRes = await axios.get(`https://www.thehindubusinessline.com/news/national/feeder/default.rss`);
    let blHtml = blRes.data;
    const $ = cheerio.load(blHtml, {xmlMode:true});
    $('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'BusinessLine', 'title': title+'(source:BusinessLine)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let etRes = await axios.get(`https://cfo.economictimes.indiatimes.com/rss/topstories`);
    let etHtml = etRes.data;
    const et$ = cheerio.load(etHtml, {xmlMode:true});
    et$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const imageUrl = $(element).children('image').text();
        let obj = {'source': 'ET', 'title': title+'(source:ET)', 'urlToImage': `${imageUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let zeeRes = await axios.get(`https://www.zeebiz.com/india.xml`);
    let zeeHtml = zeeRes.data;
    const zee$ = cheerio.load(zeeHtml, {xmlMode:true});
    zee$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        let obj = {'source': 'ZeeBusiness', 'title': title+'(source:ZeeBusiness)', 'urlToImage': `https://cdn.zeebiz.com/html/images/zee-business.png`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })


    list.sort((a,b)=> {
        let d1 = Date.parse(a.publishedAt);
        let d2 = Date.parse(b.publishedAt);
        return d2 - d1;
    })
    mainData['articles'] = list;
    newsObj['news'].push(mainData);
    mainData = {"status": "ok","articles":[]}
    console.log("Business news done!!");
    await loadEntertainment();
}

async function loadEntertainment() {
    let list = [];
    let etRes = await axios.get(`https://www.etonline.com/news/rss`);
    let etHtml = etRes.data;
    const $ = cheerio.load(etHtml, {xmlMode:true});
    $('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'EntertainmentTonight', 'title': title+'(source:EntertainmentTonight)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let toiRes = await axios.get(`https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms`);
    let toiHtml = toiRes.data;
    const toi$ = cheerio.load(toiHtml, {xmlMode:true});
    toi$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = ``;
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        let imageUrl;
        $(element).find('enclosure').each((i, e)=>{
            imageUrl = $(e).attr('url');
        });
        let obj = {'source': 'TOI', 'title': title+'(source:TOI)', 'urlToImage': `${imageUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let bhRes = await axios.get(`https://www.bollywoodhungama.com/rss/news.xml`);
    let bhHtml = bhRes.data;
    const bh$ = cheerio.load(bhHtml, {xmlMode:true});
    bh$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = ``;
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'BollywoodHungama', 'title': title+'(source:BollywoodHungama)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let zeeRes = await axios.get(`https://zeenews.india.com/rss/entertainment-news.xml`);
    let zeeHtml = zeeRes.data;
    const zee$ = cheerio.load(zeeHtml, {xmlMode:true});
    zee$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        let obj = {'source': 'ZeeNews', 'title': title+'(source:ZeeNews)', 'urlToImage': `https://english.cdn.zeenews.com/images/logo/zeenewslogo_nav.png`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let htRes = await axios.get(`https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml`);
    let htHtml = htRes.data;
    const ht$ = cheerio.load(htHtml, {xmlMode:true});
    ht$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'HindustanTimes', 'title': title+'(source:HindustanTimes)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    list.sort((a,b)=> {
        let d1 = Date.parse(a.publishedAt);
        let d2 = Date.parse(b.publishedAt);
        return d2 - d1;
    })
    mainData['articles'] = list;
    newsObj['news'].push(mainData);
    mainData = {"status": "ok","articles":[]}
    console.log("Entertainment news done!!");
    await loadHealth();
}

async function loadHealth() {
    let list = [];
    let webMdRes = await axios.get(`https://rssfeeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC`);
    let webMdHtml = webMdRes.data;
    const $ = cheerio.load(webMdHtml, {xmlMode:true});
    $('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'WebMD', 'title': title+'(source:WebMD)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let mxRes = await axios.get(`https://medicalxpress.com/rss-feed/`);
    let mxHtml = mxRes.data;
    const mx$ = cheerio.load(mxHtml, {xmlMode:true});
    mx$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:thumbnail') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'Medical Xpress', 'title': title+'(source:Medical Xpress)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let etRes = await axios.get(`https://health.economictimes.indiatimes.com/rss/topstories`);
    let etHtml = etRes.data;
    const et$ = cheerio.load(etHtml, {xmlMode:true});
    et$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const imageUrl = $(element).children('image').text();
        let obj = {'source': 'ET', 'title': title+'(source:ET)', 'urlToImage': `${imageUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let whoRes = await axios.get(`https://www.who.int/rss-feeds/news-english.xml`);
    let whoHtml = whoRes.data;
    const who$ = cheerio.load(whoHtml, {xmlMode:true});
    who$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = ``;
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const imageUrl = `https://logowik.com/content/uploads/images/who-world-health-organization5391.jpg`
        let obj = {'source': 'WHO', 'title': title+'(source:WHO)', 'urlToImage': `${imageUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    list.sort((a,b)=> {
        let d1 = Date.parse(a.publishedAt);
        let d2 = Date.parse(b.publishedAt);
        return d2 - d1;
    })
    mainData['articles'] = list;
    newsObj['news'].push(mainData);
    mainData = {"status": "ok","articles":[]}
    console.log("Health news done!!");
    await loadSci();

}

async function loadSci() {
    let list = [];
    let sdRes = await axios.get(`https://www.sciencedaily.com/rss/all.xml`);
    let sdHtml = sdRes.data;
    const $ = cheerio.load(sdHtml, {xmlMode:true});
    $('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = ``;
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const imageUrl = `https://www.sciencedaily.com/images/scidaily-logo-rss.png`
        let obj = {'source': 'ScienceDaily', 'title': title+'(source:ScienceDaily)', 'urlToImage': `${imageUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let wiRes = await axios.get(`https://www.wired.com/category/science/feed`);
    let wiHtml = wiRes.data;
    const wi$ = cheerio.load(wiHtml, {xmlMode:true});
    wi$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:thumbnail') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'Wired', 'title': title+'(source:Wired)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let nsRes = await axios.get(`https://www.newscientist.com/feed/home/?cmpid=RSS%7CNSNS-Home`);
    let nsHtml = nsRes.data;
    const ns$ = cheerio.load(nsHtml, {xmlMode:true});
    ns$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:thumbnail') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'New Scientist', 'title': title+'(source:New Scientist)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    // let mitRes = await axios.get(`https://news.mit.edu/rss/feed`);
    // let mitHtml = mitRes.data;
    // const mit$ = cheerio.load(mitHtml, {xmlMode:true});
    // mit$('item').each((index, element)=>{
    //     const title = $(element).children('title').text();
    //     const desc = $(element).children('description').text();
    //     const publishedAt = $(element).children('pubDate').text();
    //     const link = $(element).children('link').text();
    //     const children = $(element).children();
    //     let imgUrl = ``
    //     for(let x of children) {
    //         if(x['name'] == 'media:content') {
    //             imgUrl = $(x).attr('url');
    //         }
    //     }
    //     let obj = {'source': 'MIT', 'title': title+'(source:MIT)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
    //     list.push(obj);
    // })

    list.sort((a,b)=> {
        let d1 = Date.parse(a.publishedAt);
        let d2 = Date.parse(b.publishedAt);
        return d2 - d1;
    })
    mainData['articles'] = list;
    newsObj['news'].push(mainData);
    mainData = {"status": "ok","articles":[]}
    console.log("Science news done!!");
    await loadTech();
}

async function loadTech() {
    let list = [];
    let mitRes = await axios.get(`https://news.mit.edu/rss/feed`);
    let mitHtml = mitRes.data;
    const $ = cheerio.load(mitHtml, {xmlMode:true});
    $('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'MIT', 'title': title+'(source:MIT)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let vergeRes = await axios.get(`https://www.theverge.com/rss/frontpage`);
    let vergeHtml = vergeRes.data;
    const verge$ = cheerio.load(vergeHtml, {xmlMode:true});
    verge$('entry').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = ``
        const publishedAt = $(element).children('published').text();
        const link = $(element).children('id').text();
        let obj = {'source': 'The Verge', 'title': title+'(source:The Verge)', 'urlToImage': `https://logowik.com/content/uploads/images/the-verge5796.jpg`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let wiredRes = await axios.get(`https://www.wired.com/feed/rss`);
    let wiredHtml = wiredRes.data;
    const wired$ = cheerio.load(wiredHtml, {xmlMode:true});
    wired$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('id').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:thumbnail') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'Wired', 'title': title+'(source:Wired)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })
    
    list.sort((a,b)=> {
        let d1 = Date.parse(a.publishedAt);
        let d2 = Date.parse(b.publishedAt);
        return d2 - d1;
    })
    mainData['articles'] = list;
    newsObj['news'].push(mainData);
    mainData = {"status": "ok","articles":[]}
    console.log("Tech news done!!");
    await loadSport();

}

async function loadSport() {
    let list = [];
    let ndtvRes = await axios.get(`https://sports.ndtv.com/rss/all`);
    let ndtvHtml = ndtvRes.data;
    const $ = cheerio.load(ndtvHtml, {xmlMode:true});
    $('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        // const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let publishedAt = ``
        for(let x of children) {
            if(x['name'] == 'a10:updated') {
                publishedAt = $(x).text();
            }
        }
        let obj = {'source': 'NDTV', 'title': title+'(source:NDTV)', 'urlToImage': `https://logowik.com/content/uploads/images/ndtv9182.logowik.com.webp`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let espnRes = await axios.get(`https://www.espn.com/espn/rss/news`);
    let espnHtml = espnRes.data;
    const espn$ = cheerio.load(espnHtml, {xmlMode:true});
    espn$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        let imageUrl;
        $(element).find('enclosure').each((i, e)=>{
            imageUrl = $(e).attr('url');
        });
        let obj = {'source': 'ESPN', 'title': title+'(source:ESPN)', 'urlToImage': `${imageUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let toiRes = await axios.get(`https://timesofindia.indiatimes.com/rssfeeds/4719148.cms`);
    let toiHtml = toiRes.data;
    const toi$ = cheerio.load(toiHtml, {xmlMode:true});
    toi$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = ``;
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        let imageUrl;
        $(element).find('enclosure').each((i, e)=>{
            imageUrl = $(e).attr('url');
        });
        let obj = {'source': 'TOI', 'title': title+'(source:TOI)', 'urlToImage': `${imageUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    list.sort((a,b)=> {
        let d1 = Date.parse(a.publishedAt);
        let d2 = Date.parse(b.publishedAt);
        return d2 - d1;
    })
    mainData['articles'] = list;
    newsObj['news'].push(mainData);
    mainData = {"status": "ok","articles":[]}
    console.log("Sport news done!!");
    await loadOffbeat();
}
async function loadOffbeat() {
    let list = [];
    let ndtvRes = await axios.get(`http://feeds.feedburner.com/ndtvnews-offbeat-news`);
    let ndtvHtml = ndtvRes.data;
    const $ = cheerio.load(ndtvHtml, {xmlMode:true});
    $('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = $(element).children('description').text();
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:content') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'NDTV', 'title': title+'(source:NDTV)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    let abpRes = await axios.get(`https://news.abplive.com/offbeat/feed`);
    let abpHtml = abpRes.data;
    const abp$ = cheerio.load(abpHtml, {xmlMode:true});
    abp$('item').each((index, element)=>{
        const title = $(element).children('title').text();
        const desc = ``;
        const publishedAt = $(element).children('pubDate').text();
        const link = $(element).children('link').text();
        const children = $(element).children();
        let imgUrl = ``
        for(let x of children) {
            if(x['name'] == 'media:thumbnail') {
                imgUrl = $(x).attr('url');
            }
        }
        let obj = {'source': 'ABP', 'title': title+'(source:ABP)', 'urlToImage': `${imgUrl}`, 'url': link, 'publishedAt': publishedAt, 'description': desc};
        list.push(obj);
    })

    list.sort((a,b)=> {
        let d1 = Date.parse(a.publishedAt);
        let d2 = Date.parse(b.publishedAt);
        return d2 - d1;
    })
    mainData['articles'] = list;
    newsObj['news'].push(mainData);
    mainData = {"status": "ok","articles":[]}
    console.log("Offbeat news done!!");
    await saveToDb();
}

async function saveToDb() {
    console.log("saving to DB");
    newsObj['lastTime'] = Date.now();
    await client.connect()
    await client.set('all_news', JSON.stringify(newsObj));
    await client.disconnect()
}
async function mainFun() {
  await loadWorld();
}
mainFun();
