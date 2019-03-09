const accountSid = process.env.REACT_APP_TWILIO_SID
const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN
const twilioClient = require('twilio')(accountSid, authToken)
const schedule = require('node-schedule')

const scheduleTextMessage = (req, res) => {
  const { phoneNumber, message, time } = req.body
  const sendTextMessage = () => {
    twilioClient.messages
      .create({
        body: message,
        from: '+16152056956',
        to: `+${phoneNumber}`
      }).then(message => console.log('MESSAGE SENTTTTT:', message))
  }
  const biddengEndTime = new Date(time*1000).getTime() + (100 * 1000)
  schedule.scheduleJob(biddengEndTime, () => sendTextMessage())
}

module.exports = {
  scheduleTextMessage
}
