/**
 * 计时器，不断地向客户端返回当前的最新时间
 * @param req
 * @param res
 */

export default (req, res)=> {
    res.writeHead(200, {"Content-Type": "text/event-stream"});

    let timer = setInterval(()=> {
        let content = new Date().toISOString() + '\n\n';

        let b = res.write(content);
        if (!b) console.log("data got queued in memory (content=" + content + ")");
        else console.log("Flushed!(content=" + content + ")");
    }, 1000);

    req.connection.on('close', (e)=> {
        res.end();
        clearInterval(timer);
        console.info(e);
    });
};
