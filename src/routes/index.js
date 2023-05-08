const noteRouter = require('./note')
const authRouter = require('./auth')
const subNoteRouter = require('./subNote')
const percentageRouter = require('./percentage')

module.exports = (app) => {

    app.use('/auth', authRouter);
    app.use('/notes', noteRouter)
    app.use('/subNote', subNoteRouter)
    app.use('/percentage', percentageRouter);
}