import Kafka from 'node-rdkafka';

async function link(req: any, res: any) {
    const REQUEST_TOPIC = 'request'
    try {
        let data = req.body
        let message = JSON.stringify(data)
        const integrateProducer = Kafka.Producer.createWriteStream({
            'metadata.broker.list': 'localhost:9092'
        }, {}, {
            topic: REQUEST_TOPIC
        })

        const success = integrateProducer.write(Buffer.from(message))
        if (success) {
            console.log(`Integrate send ipn to wallet: ${message}`);
        } else {
            console.log('Integrate send ipn to wallet fail');
        }
        res.json({
            status: 200,
            errorCode: 0,
            message: 'success',
            data: null,
        })
    }
    catch (error) {
        res.json({
            error: error
        })
    }
}

module.exports = {
    link: link
}