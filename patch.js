
        
                const i32 = (v) => v
                const f32 = i32
                const f64 = i32
                
function toInt(v) {
                    return v
                }
function toFloat(v) {
                    return v
                }
function createFloatArray(length) {
                    return new Float64Array(length)
                }
function setFloatDataView(dataView, position, value) {
                    dataView.setFloat64(position, value)
                }
function getFloatDataView(dataView, position) {
                    return dataView.getFloat64(position)
                }
let IT_FRAME = 0
let FRAME = 0
let BLOCK_SIZE = 0
let SAMPLE_RATE = 0
let NULL_SIGNAL = 0
let INPUT = createFloatArray(0)
let OUTPUT = createFloatArray(0)
const G_sked_ID_NULL = -1
const G_sked__ID_COUNTER_INIT = 1
const G_sked__MODE_WAIT = 0
const G_sked__MODE_SUBSCRIBE = 1


function G_sked_create(isLoggingEvents) {
                return {
                    eventLog: new Set(),
                    events: new Map(),
                    requests: new Map(),
                    idCounter: G_sked__ID_COUNTER_INIT,
                    isLoggingEvents,
                }
            }
function G_sked_wait(skeduler, event, callback) {
                if (skeduler.isLoggingEvents === false) {
                    throw new Error("Please activate skeduler's isLoggingEvents")
                }

                if (skeduler.eventLog.has(event)) {
                    callback(event)
                    return G_sked_ID_NULL
                } else {
                    return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_WAIT)
                }
            }
function G_sked_waitFuture(skeduler, event, callback) {
                return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_WAIT)
            }
function G_sked_subscribe(skeduler, event, callback) {
                return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_SUBSCRIBE)
            }
function G_sked_emit(skeduler, event) {
                if (skeduler.isLoggingEvents === true) {
                    skeduler.eventLog.add(event)
                }
                if (skeduler.events.has(event)) {
                    const skedIds = skeduler.events.get(event)
                    const skedIdsStaying = []
                    for (let i = 0; i < skedIds.length; i++) {
                        if (skeduler.requests.has(skedIds[i])) {
                            const request = skeduler.requests.get(skedIds[i])
                            request.callback(event)
                            if (request.mode === G_sked__MODE_WAIT) {
                                skeduler.requests.delete(request.id)
                            } else {
                                skedIdsStaying.push(request.id)
                            }
                        }
                    }
                    skeduler.events.set(event, skedIdsStaying)
                }
            }
function G_sked_cancel(skeduler, id) {
                skeduler.requests.delete(id)
            }
function G_sked__createRequest(skeduler, event, callback, mode) {
                const id = G_sked__nextId(skeduler)
                const request = {
                    id, 
                    mode, 
                    callback,
                }
                skeduler.requests.set(id, request)
                if (!skeduler.events.has(event)) {
                    skeduler.events.set(event, [id])    
                } else {
                    skeduler.events.get(event).push(id)
                }
                return id
            }
function G_sked__nextId(skeduler) {
                return skeduler.idCounter++
            }
const G_commons__ARRAYS = new Map()
const G_commons__ARRAYS_SKEDULER = G_sked_create(false)
function G_commons_getArray(arrayName) {
            if (!G_commons__ARRAYS.has(arrayName)) {
                throw new Error('Unknown array ' + arrayName)
            }
            return G_commons__ARRAYS.get(arrayName)
        }
function G_commons_hasArray(arrayName) {
            return G_commons__ARRAYS.has(arrayName)
        }
function G_commons_setArray(arrayName, array) {
            G_commons__ARRAYS.set(arrayName, array)
            G_sked_emit(G_commons__ARRAYS_SKEDULER, arrayName)
        }
function G_commons_subscribeArrayChanges(arrayName, callback) {
            const id = G_sked_subscribe(G_commons__ARRAYS_SKEDULER, arrayName, callback)
            if (G_commons__ARRAYS.has(arrayName)) {
                callback(arrayName)
            }
            return id
        }
function G_commons_cancelArrayChangesSubscription(id) {
            G_sked_cancel(G_commons__ARRAYS_SKEDULER, id)
        }

const G_commons__FRAME_SKEDULER = G_sked_create(false)
function G_commons__emitFrame(frame) {
            G_sked_emit(G_commons__FRAME_SKEDULER, frame.toString())
        }
function G_commons_waitFrame(frame, callback) {
            return G_sked_waitFuture(G_commons__FRAME_SKEDULER, frame.toString(), callback)
        }
function G_commons_cancelWaitFrame(id) {
            G_sked_cancel(G_commons__FRAME_SKEDULER, id)
        }
const G_msg_FLOAT_TOKEN = "number"
const G_msg_STRING_TOKEN = "string"
function G_msg_create(template) {
                    const m = []
                    let i = 0
                    while (i < template.length) {
                        if (template[i] === G_msg_STRING_TOKEN) {
                            m.push('')
                            i += 2
                        } else if (template[i] === G_msg_FLOAT_TOKEN) {
                            m.push(0)
                            i += 1
                        }
                    }
                    return m
                }
function G_msg_getLength(message) {
                    return message.length
                }
function G_msg_getTokenType(message, tokenIndex) {
                    return typeof message[tokenIndex]
                }
function G_msg_isStringToken(message, tokenIndex) {
                    return G_msg_getTokenType(message, tokenIndex) === 'string'
                }
function G_msg_isFloatToken(message, tokenIndex) {
                    return G_msg_getTokenType(message, tokenIndex) === 'number'
                }
function G_msg_isMatching(message, tokenTypes) {
                    return (message.length === tokenTypes.length) 
                        && message.every((v, i) => G_msg_getTokenType(message, i) === tokenTypes[i])
                }
function G_msg_writeFloatToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function G_msg_writeStringToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function G_msg_readFloatToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function G_msg_readStringToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function G_msg_floats(values) {
                    return values
                }
function G_msg_strings(values) {
                    return values
                }
function G_msg_display(message) {
                    return '[' + message
                        .map(t => typeof t === 'string' ? '"' + t + '"' : t.toString())
                        .join(', ') + ']'
                }
function G_msg_VOID_MESSAGE_RECEIVER(m) {}
let G_msg_EMPTY_MESSAGE = G_msg_create([])
function G_bangUtils_isBang(message) {
            return (
                G_msg_isStringToken(message, 0) 
                && G_msg_readStringToken(message, 0) === 'bang'
            )
        }
function G_bangUtils_bang() {
            const message = G_msg_create([G_msg_STRING_TOKEN, 4])
            G_msg_writeStringToken(message, 0, 'bang')
            return message
        }
function G_bangUtils_emptyToBang(message) {
            if (G_msg_getLength(message) === 0) {
                return G_bangUtils_bang()
            } else {
                return message
            }
        }
const G_msgBuses__BUSES = new Map()
function G_msgBuses_publish(busName, message) {
            let i = 0
            const callbacks = G_msgBuses__BUSES.has(busName) ? G_msgBuses__BUSES.get(busName): []
            for (i = 0; i < callbacks.length; i++) {
                callbacks[i](message)
            }
        }
function G_msgBuses_subscribe(busName, callback) {
            if (!G_msgBuses__BUSES.has(busName)) {
                G_msgBuses__BUSES.set(busName, [])
            }
            G_msgBuses__BUSES.get(busName).push(callback)
        }
function G_msgBuses_unsubscribe(busName, callback) {
            if (!G_msgBuses__BUSES.has(busName)) {
                return
            }
            const callbacks = G_msgBuses__BUSES.get(busName)
            const found = callbacks.indexOf(callback)
            if (found !== -1) {
                callbacks.splice(found, 1)
            }
        }
function G_msgUtils_slice(message, start, end) {
            if (G_msg_getLength(message) <= start) {
                throw new Error('message empty')
            }
            const template = G_msgUtils__copyTemplate(message, start, end)
            const newMessage = G_msg_create(template)
            G_msgUtils_copy(message, newMessage, start, end, 0)
            return newMessage
        }
function G_msgUtils_concat(message1, message2) {
            const newMessage = G_msg_create(G_msgUtils__copyTemplate(message1, 0, G_msg_getLength(message1)).concat(G_msgUtils__copyTemplate(message2, 0, G_msg_getLength(message2))))
            G_msgUtils_copy(message1, newMessage, 0, G_msg_getLength(message1), 0)
            G_msgUtils_copy(message2, newMessage, 0, G_msg_getLength(message2), G_msg_getLength(message1))
            return newMessage
        }
function G_msgUtils_shift(message) {
            switch (G_msg_getLength(message)) {
                case 0:
                    throw new Error('message empty')
                case 1:
                    return G_msg_create([])
                default:
                    return G_msgUtils_slice(message, 1, G_msg_getLength(message))
            }
        }
function G_msgUtils_copy(src, dest, srcStart, srcEnd, destStart) {
            let i = srcStart
            let j = destStart
            for (i, j; i < srcEnd; i++, j++) {
                if (G_msg_getTokenType(src, i) === G_msg_STRING_TOKEN) {
                    G_msg_writeStringToken(dest, j, G_msg_readStringToken(src, i))
                } else {
                    G_msg_writeFloatToken(dest, j, G_msg_readFloatToken(src, i))
                }
            }
        }
function G_msgUtils__copyTemplate(src, start, end) {
            const template = []
            for (let i = start; i < end; i++) {
                const tokenType = G_msg_getTokenType(src, i)
                template.push(tokenType)
                if (tokenType === G_msg_STRING_TOKEN) {
                    template.push(G_msg_readStringToken(src, i).length)
                }
            }
            return template
        }
function computeUnitInSamples(sampleRate, amount, unit) {
        if (unit.slice(0, 3) === 'per') {
            if (amount !== 0) {
                amount = 1 / amount
            }
            unit = unit.slice(3)
        }

        if (unit === 'msec' || unit === 'milliseconds' || unit === 'millisecond') {
            return amount / 1000 * sampleRate
        } else if (unit === 'sec' || unit === 'seconds' || unit === 'second') {
            return amount * sampleRate
        } else if (unit === 'min' || unit === 'minutes' || unit === 'minute') {
            return amount * 60 * sampleRate
        } else if (unit === 'samp' || unit === 'samples' || unit === 'sample') {
            return amount
        } else {
            throw new Error("invalid time unit : " + unit)
        }
    }
function G_actionUtils_isAction(message, action) {
            return G_msg_isMatching(message, [G_msg_STRING_TOKEN])
                && G_msg_readStringToken(message, 0) === action
        }
        
function NT_hsl_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_hsl_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_hsl_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_hsl_defaultMessageHandler(m) {}
function NT_hsl_receiveMessage(state, m) {
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        state.valueFloat = G_msg_readFloatToken(m, 0)
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (G_bangUtils_isBang(m)) {
                        
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (
                        G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN]) 
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        state.valueFloat = G_msg_readFloatToken(m, 1)
                        return
                    
                    } else if (NT_hsl_setSendReceiveFromMessage(state, m) === true) {
                        return
                    }
                }



function NT_hradio_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_hradio_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_hradio_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_hradio_defaultMessageHandler(m) {}
function NT_hradio_receiveMessage(state, m) {
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        state.valueFloat = G_msg_readFloatToken(m, 0)
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (G_bangUtils_isBang(m)) {
                        
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (
                        G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN]) 
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        state.valueFloat = G_msg_readFloatToken(m, 1)
                        return
                    
                    } else if (NT_hradio_setSendReceiveFromMessage(state, m) === true) {
                        return
                    }
                }

function NT_tgl_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_tgl_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_tgl_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_tgl_defaultMessageHandler(m) {}
function NT_tgl_receiveMessage(state, m) {
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        state.valueFloat = G_msg_readFloatToken(m, 0)
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (G_bangUtils_isBang(m)) {
                        state.valueFloat = state.valueFloat === 0 ? state.maxValue: 0
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (
                        G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN]) 
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        state.valueFloat = G_msg_readFloatToken(m, 1)
                        return
                    
                    } else if (NT_tgl_setSendReceiveFromMessage(state, m) === true) {
                        return
                    }
                }

function NT_nbx_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_nbx_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_nbx_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_nbx_defaultMessageHandler(m) {}
function NT_nbx_receiveMessage(state, m) {
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        state.valueFloat = Math.min(Math.max(G_msg_readFloatToken(m, 0),state.minValue),state.maxValue)
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (G_bangUtils_isBang(m)) {
                        
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (
                        G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN]) 
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        state.valueFloat = Math.min(Math.max(G_msg_readFloatToken(m, 1),state.minValue),state.maxValue)
                        return
                    
                    } else if (NT_nbx_setSendReceiveFromMessage(state, m) === true) {
                        return
                    }
                }

function NT_floatatom_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_floatatom_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_floatatom_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_floatatom_defaultMessageHandler(m) {}
function NT_floatatom_receiveMessage(state, m) {
                    if (G_bangUtils_isBang(m)) {
                        state.messageSender(state.value)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, state.value)
                        }
                        return
                    
                    } else if (
                        G_msg_getTokenType(m, 0) === G_msg_STRING_TOKEN
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        const setMessage = G_msgUtils_slice(m, 1, G_msg_getLength(m))
                        if (G_msg_isMatching(setMessage, [G_msg_FLOAT_TOKEN])) { 
                                state.value = setMessage    
                                return
                        }
        
                    } else if (NT_floatatom_setSendReceiveFromMessage(state, m) === true) {
                        return
                        
                    } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                    
                        state.value = m
                        state.messageSender(state.value)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, state.value)
                        }
                        return
        
                    }
                }

function NT_vsl_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_vsl_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_vsl_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_vsl_defaultMessageHandler(m) {}
function NT_vsl_receiveMessage(state, m) {
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        state.valueFloat = G_msg_readFloatToken(m, 0)
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (G_bangUtils_isBang(m)) {
                        
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (
                        G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN]) 
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        state.valueFloat = G_msg_readFloatToken(m, 1)
                        return
                    
                    } else if (NT_vsl_setSendReceiveFromMessage(state, m) === true) {
                        return
                    }
                }

function NT_mul_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_mul_setRight(state, value) {
                    state.rightOp = value
                }

function NT_metro_setRate(state, rate) {
                state.rate = Math.max(rate, 0)
            }
function NT_metro_scheduleNextTick(state) {
                state.snd0(G_bangUtils_bang())
                state.realNextTick = state.realNextTick + state.rate * state.sampleRatio
                state.skedId = G_commons_waitFrame(
                    toInt(Math.round(state.realNextTick)), 
                    state.tickCallback,
                )
            }
function NT_metro_stop(state) {
                if (state.skedId !== G_sked_ID_NULL) {
                    G_commons_cancelWaitFrame(state.skedId)
                    state.skedId = G_sked_ID_NULL
                }
                state.realNextTick = 0
            }

function NT_float_setValue(state, value) {
                state.value = value
            }

function NT_add_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_add_setRight(state, value) {
                    state.rightOp = value
                }

function NT_modlegacy_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_modlegacy_setRight(state, value) {
                    state.rightOp = value
                }

function NT_eq_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_eq_setRight(state, value) {
                    state.rightOp = value
                }



        const N_n_0_0_state = {
                                minValue: 0,
maxValue: 3,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_hsl_defaultMessageHandler,
messageSender: NT_hsl_defaultMessageHandler,
                            }
const N_n_0_1_state = {
                                minValue: 0,
maxValue: 4,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_hradio_defaultMessageHandler,
messageSender: NT_hradio_defaultMessageHandler,
                            }
const N_n_0_4_state = {
                                minValue: 0,
maxValue: 1,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_tgl_defaultMessageHandler,
messageSender: NT_tgl_defaultMessageHandler,
                            }
const N_n_0_6_state = {
                                minValue: -1e+37,
maxValue: 1e+37,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_nbx_defaultMessageHandler,
messageSender: NT_nbx_defaultMessageHandler,
                            }
const N_n_0_7_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_8_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_9_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_10_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_11_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_12_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_13_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_14_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_15_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_16_state = {
                                minValue: 0,
maxValue: 127,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_vsl_defaultMessageHandler,
messageSender: NT_vsl_defaultMessageHandler,
                            }
const N_n_0_20_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_21_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_22_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_23_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_17_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_24_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_18_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_25_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_19_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_28_state = {
                                minValue: -1e+37,
maxValue: 1e+37,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_nbx_defaultMessageHandler,
messageSender: NT_nbx_defaultMessageHandler,
                            }
const N_n_1_1_state = {
                                minValue: 200,
maxValue: 1e+37,
valueFloat: 200,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_nbx_defaultMessageHandler,
messageSender: NT_nbx_defaultMessageHandler,
                            }
const N_n_1_0_state = {
                                rate: 0,
sampleRatio: 1,
skedId: G_sked_ID_NULL,
realNextTick: -1,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_n_1_2_state = {
                                value: 0,
                            }
const N_n_1_3_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_1_5_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_2_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_5_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_1_4_state = {
                                minValue: 0,
maxValue: 1,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_tgl_defaultMessageHandler,
messageSender: NT_tgl_defaultMessageHandler,
                            }
        
function N_n_0_0_rcvs_0(m) {
                            
                NT_hsl_receiveMessage(N_n_0_0_state, m)
                return
            
                            throw new Error('Node "n_0_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_0_0_rcvs_0(m) {
                            
                IO_snd_n_0_0_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_0_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_1_rcvs_0(m) {
                            
                NT_hradio_receiveMessage(N_n_0_1_state, m)
                return
            
                            throw new Error('Node "n_0_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_1_0_rcvs_0(m) {
                            
                IO_snd_n_0_1_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_1_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_4_rcvs_0(m) {
                            
                NT_tgl_receiveMessage(N_n_0_4_state, m)
                return
            
                            throw new Error('Node "n_0_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_4_0_rcvs_0(m) {
                            
                IO_snd_n_0_4_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_4_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_6_rcvs_0(m) {
                            
                NT_nbx_receiveMessage(N_n_0_6_state, m)
                return
            
                            throw new Error('Node "n_0_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_6_0_rcvs_0(m) {
                            
                IO_snd_n_0_6_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_6_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_7_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_7_state, m)
                return
            
                            throw new Error('Node "n_0_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_7_0_rcvs_0(m) {
                            
                IO_snd_n_0_7_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_7_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_8_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_8_state, m)
                return
            
                            throw new Error('Node "n_0_8", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_8_0_rcvs_0(m) {
                            
                IO_snd_n_0_8_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_8_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_9_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_9_state, m)
                return
            
                            throw new Error('Node "n_0_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_9_0_rcvs_0(m) {
                            
                IO_snd_n_0_9_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_9_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_10_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_10_state, m)
                return
            
                            throw new Error('Node "n_0_10", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_10_0_rcvs_0(m) {
                            
                IO_snd_n_0_10_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_10_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_11_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_11_state, m)
                return
            
                            throw new Error('Node "n_0_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_11_0_rcvs_0(m) {
                            
                IO_snd_n_0_11_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_11_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_12_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_12_state, m)
                return
            
                            throw new Error('Node "n_0_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_12_0_rcvs_0(m) {
                            
                IO_snd_n_0_12_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_12_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_13_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_13_state, m)
                return
            
                            throw new Error('Node "n_0_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_13_0_rcvs_0(m) {
                            
                IO_snd_n_0_13_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_13_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_14_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_14_state, m)
                return
            
                            throw new Error('Node "n_0_14", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_14_0_rcvs_0(m) {
                            
                IO_snd_n_0_14_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_14_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_15_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_15_state, m)
                return
            
                            throw new Error('Node "n_0_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_15_0_rcvs_0(m) {
                            
                IO_snd_n_0_15_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_15_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_16_rcvs_0(m) {
                            
                NT_vsl_receiveMessage(N_n_0_16_state, m)
                return
            
                            throw new Error('Node "n_0_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_20_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_20_state, G_msg_readFloatToken(m, 0))
                        N_n_0_7_rcvs_0(G_msg_floats([N_n_0_20_state.leftOp * N_n_0_20_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_7_rcvs_0(G_msg_floats([N_n_0_20_state.leftOp * N_n_0_20_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_20", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_21_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_21_state, G_msg_readFloatToken(m, 0))
                        N_n_0_21_snds_0(G_msg_floats([N_n_0_21_state.leftOp * N_n_0_21_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_21_snds_0(G_msg_floats([N_n_0_21_state.leftOp * N_n_0_21_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_21", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_22_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_22_state, G_msg_readFloatToken(m, 0))
                        N_n_0_22_snds_0(G_msg_floats([N_n_0_22_state.leftOp * N_n_0_22_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_22_snds_0(G_msg_floats([N_n_0_22_state.leftOp * N_n_0_22_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_22", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_23_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_23_state, G_msg_readFloatToken(m, 0))
                        N_n_0_23_snds_0(G_msg_floats([N_n_0_23_state.leftOp * N_n_0_23_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_23_snds_0(G_msg_floats([N_n_0_23_state.leftOp * N_n_0_23_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_23", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_17_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_17_state, m)
                return
            
                            throw new Error('Node "n_0_17", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_17_0_rcvs_0(m) {
                            
                IO_snd_n_0_17_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_17_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_24_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_24_state, G_msg_readFloatToken(m, 0))
                        N_n_0_24_snds_0(G_msg_floats([N_n_0_24_state.leftOp * N_n_0_24_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_24_snds_0(G_msg_floats([N_n_0_24_state.leftOp * N_n_0_24_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_24", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_18_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_18_state, m)
                return
            
                            throw new Error('Node "n_0_18", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_18_0_rcvs_0(m) {
                            
                IO_snd_n_0_18_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_18_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_25_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_25_state, G_msg_readFloatToken(m, 0))
                        N_n_0_19_rcvs_0(G_msg_floats([N_n_0_25_state.leftOp * N_n_0_25_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_19_rcvs_0(G_msg_floats([N_n_0_25_state.leftOp * N_n_0_25_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_25", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_19_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_19_state, m)
                return
            
                            throw new Error('Node "n_0_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_19_0_rcvs_0(m) {
                            
                IO_snd_n_0_19_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_19_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_16_0_rcvs_0(m) {
                            
                IO_snd_n_0_16_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_16_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_28_rcvs_0(m) {
                            
                NT_nbx_receiveMessage(N_n_0_28_state, m)
                return
            
                            throw new Error('Node "n_0_28", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_28_0_rcvs_0(m) {
                            
                IO_snd_n_0_28_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_28_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_1_rcvs_0(m) {
                            
                NT_nbx_receiveMessage(N_n_1_1_state, m)
                return
            
                            throw new Error('Node "n_1_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_0_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (
                    (G_msg_isFloatToken(m, 0) && G_msg_readFloatToken(m, 0) === 0)
                    || G_actionUtils_isAction(m, 'stop')
                ) {
                    NT_metro_stop(N_n_1_0_state)
                    return
    
                } else if (
                    G_msg_isFloatToken(m, 0)
                    || G_bangUtils_isBang(m)
                ) {
                    N_n_1_0_state.realNextTick = toFloat(FRAME)
                    NT_metro_scheduleNextTick(N_n_1_0_state)
                    return
                }
            }
        
                            throw new Error('Node "n_1_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_1_0_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_metro_setRate(N_n_1_0_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_1_0", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_2_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_1_2_state, G_msg_readFloatToken(m, 0))
                N_n_1_3_rcvs_0(G_msg_floats([N_n_1_2_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_1_3_rcvs_0(G_msg_floats([N_n_1_2_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_1_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_1_2_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_float_setValue(N_n_1_2_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_1_2", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_3_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_1_3_state, G_msg_readFloatToken(m, 0))
                        N_n_1_3_snds_0(G_msg_floats([N_n_1_3_state.leftOp + N_n_1_3_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_1_3_snds_0(G_msg_floats([N_n_1_3_state.leftOp + N_n_1_3_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_1_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_5_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_modlegacy_setLeft(N_n_1_5_state, G_msg_readFloatToken(m, 0))
                        N_n_1_5_snds_0(G_msg_floats([N_n_1_5_state.leftOp % N_n_1_5_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_1_5_snds_0(G_msg_floats([N_n_1_5_state.leftOp % N_n_1_5_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_1_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_2_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_2_state, G_msg_readFloatToken(m, 0))
                        N_n_0_2_snds_0(G_msg_floats([N_n_0_2_state.leftOp + N_n_0_2_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_2_snds_0(G_msg_floats([N_n_0_2_state.leftOp + N_n_0_2_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_5_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_eq_setLeft(N_n_0_5_state, G_msg_readFloatToken(m, 0))
                        N_n_0_4_rcvs_0(G_msg_floats([N_n_0_5_state.leftOp == N_n_0_5_state.rightOp ? 1: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_4_rcvs_0(G_msg_floats([N_n_0_5_state.leftOp == N_n_0_5_state.rightOp ? 1: 0]))
                        return
                    }
                
                            throw new Error('Node "n_0_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_1_1_0_rcvs_0(m) {
                            
                IO_snd_n_1_1_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_1_1_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_4_rcvs_0(m) {
                            
                NT_tgl_receiveMessage(N_n_1_4_state, m)
                return
            
                            throw new Error('Node "n_1_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_1_4_0_rcvs_0(m) {
                            
                IO_snd_n_1_4_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_1_4_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }








































function N_n_0_16_snds_0(m) {
                        N_n_0_20_rcvs_0(m)
N_n_0_21_rcvs_0(m)
N_n_0_22_rcvs_0(m)
N_n_0_23_rcvs_0(m)
N_n_0_24_rcvs_0(m)
N_n_0_25_rcvs_0(m)
N_n_ioSnd_n_0_16_0_rcvs_0(m)
                    }
function N_n_0_21_snds_0(m) {
                        N_n_0_8_rcvs_0(m)
N_n_0_10_rcvs_0(m)
                    }
function N_n_0_22_snds_0(m) {
                        N_n_0_9_rcvs_0(m)
N_n_0_11_rcvs_0(m)
N_n_0_13_rcvs_0(m)
                    }
function N_n_0_23_snds_0(m) {
                        N_n_0_12_rcvs_0(m)
N_n_0_14_rcvs_0(m)
N_n_0_17_rcvs_0(m)
                    }
function N_n_0_24_snds_0(m) {
                        N_n_0_15_rcvs_0(m)
N_n_0_18_rcvs_0(m)
                    }
function N_n_1_1_snds_0(m) {
                        N_n_1_0_rcvs_1(m)
N_n_ioSnd_n_1_1_0_rcvs_0(m)
                    }
function N_n_1_3_snds_0(m) {
                        N_n_0_28_rcvs_0(m)
N_n_1_2_rcvs_1(m)
N_n_1_5_rcvs_0(m)
                    }
function N_n_1_5_snds_0(m) {
                        N_n_0_0_rcvs_0(m)
N_n_0_1_rcvs_0(m)
N_n_0_2_rcvs_0(m)
                    }
function N_n_0_2_snds_0(m) {
                        N_n_0_5_rcvs_0(m)
N_n_0_6_rcvs_0(m)
                    }
function N_n_1_4_snds_0(m) {
                        N_n_1_0_rcvs_0(m)
N_n_ioSnd_n_1_4_0_rcvs_0(m)
                    }

        
        function IO_rcv_n_0_0_0(m) {
                    N_n_0_0_rcvs_0(m)
                }
function IO_rcv_n_0_1_0(m) {
                    N_n_0_1_rcvs_0(m)
                }
function IO_rcv_n_1_1_0(m) {
                    N_n_1_1_rcvs_0(m)
                }
function IO_rcv_n_1_4_0(m) {
                    N_n_1_4_rcvs_0(m)
                }
function IO_rcv_n_0_4_0(m) {
                    N_n_0_4_rcvs_0(m)
                }
function IO_rcv_n_0_6_0(m) {
                    N_n_0_6_rcvs_0(m)
                }
function IO_rcv_n_0_7_0(m) {
                    N_n_0_7_rcvs_0(m)
                }
function IO_rcv_n_0_8_0(m) {
                    N_n_0_8_rcvs_0(m)
                }
function IO_rcv_n_0_9_0(m) {
                    N_n_0_9_rcvs_0(m)
                }
function IO_rcv_n_0_10_0(m) {
                    N_n_0_10_rcvs_0(m)
                }
function IO_rcv_n_0_11_0(m) {
                    N_n_0_11_rcvs_0(m)
                }
function IO_rcv_n_0_12_0(m) {
                    N_n_0_12_rcvs_0(m)
                }
function IO_rcv_n_0_13_0(m) {
                    N_n_0_13_rcvs_0(m)
                }
function IO_rcv_n_0_14_0(m) {
                    N_n_0_14_rcvs_0(m)
                }
function IO_rcv_n_0_15_0(m) {
                    N_n_0_15_rcvs_0(m)
                }
function IO_rcv_n_0_16_0(m) {
                    N_n_0_16_rcvs_0(m)
                }
function IO_rcv_n_0_17_0(m) {
                    N_n_0_17_rcvs_0(m)
                }
function IO_rcv_n_0_18_0(m) {
                    N_n_0_18_rcvs_0(m)
                }
function IO_rcv_n_0_19_0(m) {
                    N_n_0_19_rcvs_0(m)
                }
function IO_rcv_n_0_28_0(m) {
                    N_n_0_28_rcvs_0(m)
                }
        const IO_snd_n_0_0_0 = (m) => {exports.io.messageSenders['n_0_0']['0'](m)}
const IO_snd_n_0_1_0 = (m) => {exports.io.messageSenders['n_0_1']['0'](m)}
const IO_snd_n_1_1_0 = (m) => {exports.io.messageSenders['n_1_1']['0'](m)}
const IO_snd_n_1_4_0 = (m) => {exports.io.messageSenders['n_1_4']['0'](m)}
const IO_snd_n_0_4_0 = (m) => {exports.io.messageSenders['n_0_4']['0'](m)}
const IO_snd_n_0_6_0 = (m) => {exports.io.messageSenders['n_0_6']['0'](m)}
const IO_snd_n_0_7_0 = (m) => {exports.io.messageSenders['n_0_7']['0'](m)}
const IO_snd_n_0_8_0 = (m) => {exports.io.messageSenders['n_0_8']['0'](m)}
const IO_snd_n_0_9_0 = (m) => {exports.io.messageSenders['n_0_9']['0'](m)}
const IO_snd_n_0_10_0 = (m) => {exports.io.messageSenders['n_0_10']['0'](m)}
const IO_snd_n_0_11_0 = (m) => {exports.io.messageSenders['n_0_11']['0'](m)}
const IO_snd_n_0_12_0 = (m) => {exports.io.messageSenders['n_0_12']['0'](m)}
const IO_snd_n_0_13_0 = (m) => {exports.io.messageSenders['n_0_13']['0'](m)}
const IO_snd_n_0_14_0 = (m) => {exports.io.messageSenders['n_0_14']['0'](m)}
const IO_snd_n_0_15_0 = (m) => {exports.io.messageSenders['n_0_15']['0'](m)}
const IO_snd_n_0_16_0 = (m) => {exports.io.messageSenders['n_0_16']['0'](m)}
const IO_snd_n_0_17_0 = (m) => {exports.io.messageSenders['n_0_17']['0'](m)}
const IO_snd_n_0_18_0 = (m) => {exports.io.messageSenders['n_0_18']['0'](m)}
const IO_snd_n_0_19_0 = (m) => {exports.io.messageSenders['n_0_19']['0'](m)}
const IO_snd_n_0_28_0 = (m) => {exports.io.messageSenders['n_0_28']['0'](m)}

        const exports = {
            metadata: {"libVersion":"0.1.0","customMetadata":{"pdNodes":{"0":{"0":{"id":"0","type":"hsl","args":[0,3,0,0,"",""],"nodeClass":"control","layout":{"x":54,"y":204,"width":115,"height":15,"log":0,"label":"","labelX":-2,"labelY":-8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000","steadyOnClick":"1"}},"1":{"id":"1","type":"hradio","args":[4,0,0,"","",0],"nodeClass":"control","layout":{"x":51,"y":241,"size":30,"label":"","labelX":0,"labelY":-8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}},"3":{"id":"3","type":"pd","patchId":"1","nodeClass":"subpatch","args":["metro"],"layout":{"x":50,"y":152}},"4":{"id":"4","type":"tgl","args":[1,0,0,"",""],"nodeClass":"control","layout":{"x":51,"y":288,"size":30,"label":"First","labelX":17,"labelY":7,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}},"6":{"id":"6","type":"nbx","args":[-1e+37,1e+37,0,0,"",""],"nodeClass":"control","layout":{"x":92,"y":288,"widthInChars":5,"height":30,"log":0,"label":"","labelX":0,"labelY":-8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000","logHeight":"256"}},"7":{"id":"7","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":299,"y":211,"widthInChars":5,"labelPos":0,"label":""}},"8":{"id":"8","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":347,"y":211,"widthInChars":5,"labelPos":0,"label":""}},"9":{"id":"9","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":395,"y":211,"widthInChars":5,"labelPos":0,"label":""}},"10":{"id":"10","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":299,"y":241,"widthInChars":5,"labelPos":0,"label":""}},"11":{"id":"11","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":347,"y":241,"widthInChars":5,"labelPos":0,"label":""}},"12":{"id":"12","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":395,"y":241,"widthInChars":5,"labelPos":0,"label":""}},"13":{"id":"13","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":299,"y":271,"widthInChars":5,"labelPos":0,"label":""}},"14":{"id":"14","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":347,"y":271,"widthInChars":5,"labelPos":0,"label":""}},"15":{"id":"15","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":395,"y":271,"widthInChars":5,"labelPos":0,"label":""}},"16":{"id":"16","type":"vsl","args":[0,127,0,0,"",""],"nodeClass":"control","layout":{"x":266,"y":212,"width":15,"height":100,"log":0,"label":"","labelX":0,"labelY":-9,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000","steadyOnClick":"1"}},"17":{"id":"17","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":299,"y":301,"widthInChars":5,"labelPos":0,"label":""}},"18":{"id":"18","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":347,"y":301,"widthInChars":5,"labelPos":0,"label":""}},"19":{"id":"19","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":395,"y":301,"widthInChars":5,"labelPos":0,"label":""}},"26":{"id":"26","type":"text","args":["Move slider to update number boxes"],"nodeClass":"text","layout":{"x":271,"y":331}},"27":{"id":"27","type":"text","args":["A metronome to play with"],"nodeClass":"text","layout":{"x":55,"y":332}},"28":{"id":"28","type":"nbx","args":[-1e+37,1e+37,0,0,"",""],"nodeClass":"control","layout":{"x":137,"y":288,"widthInChars":5,"height":30,"log":0,"label":"","labelX":0,"labelY":-8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000","logHeight":"256"}},"29":{"id":"29","type":"text","args":["NOTE : This demo makes no sound. It is just a showcase of two way message communication between WebPd and a web page"],"nodeClass":"text","layout":{"x":498,"y":179}}},"1":{"1":{"id":"1","type":"nbx","args":[200,1e+37,1,200,"",""],"nodeClass":"control","layout":{"x":199,"y":118,"widthInChars":5,"height":30,"log":0,"label":"interval","labelX":0,"labelY":-8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000","logHeight":"256"}},"4":{"id":"4","type":"tgl","args":[1,1,0,"",""],"nodeClass":"control","layout":{"x":116,"y":117,"size":30,"label":"On/Off","labelX":17,"labelY":7,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}}}},"graph":{"n_0_0":{"id":"n_0_0","type":"hsl","args":{"minValue":0,"maxValue":3,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_1_5","portletId":"0"},{"nodeId":"n_ioRcv_n_0_0_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_0_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_1":{"id":"n_0_1","type":"hradio","args":{"minValue":0,"maxValue":4,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_1_5","portletId":"0"},{"nodeId":"n_ioRcv_n_0_1_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_1_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_1_1":{"id":"n_1_1","type":"nbx","args":{"minValue":200,"maxValue":1e+37,"sendBusName":"empty","receiveBusName":"empty","initValue":200,"outputOnLoad":true},"sources":{"0":[{"nodeId":"n_ioRcv_n_1_1_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_1_0","portletId":"1"},{"nodeId":"n_ioSnd_n_1_1_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_1_4":{"id":"n_1_4","type":"tgl","args":{"minValue":0,"maxValue":1,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":true},"sources":{"0":[{"nodeId":"n_ioRcv_n_1_4_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_1_0","portletId":"0"},{"nodeId":"n_ioSnd_n_1_4_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_4":{"id":"n_0_4","type":"tgl","args":{"minValue":0,"maxValue":1,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_0_5","portletId":"0"},{"nodeId":"n_ioRcv_n_0_4_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_4_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_6":{"id":"n_0_6","type":"nbx","args":{"minValue":-1e+37,"maxValue":1e+37,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_0_2","portletId":"0"},{"nodeId":"n_ioRcv_n_0_6_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_6_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_7":{"id":"n_0_7","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_20","portletId":"0"},{"nodeId":"n_ioRcv_n_0_7_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_7_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_8":{"id":"n_0_8","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_21","portletId":"0"},{"nodeId":"n_ioRcv_n_0_8_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_8_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_9":{"id":"n_0_9","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_22","portletId":"0"},{"nodeId":"n_ioRcv_n_0_9_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_9_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_10":{"id":"n_0_10","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_21","portletId":"0"},{"nodeId":"n_ioRcv_n_0_10_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_10_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_11":{"id":"n_0_11","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_22","portletId":"0"},{"nodeId":"n_ioRcv_n_0_11_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_11_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_12":{"id":"n_0_12","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_23","portletId":"0"},{"nodeId":"n_ioRcv_n_0_12_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_12_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_13":{"id":"n_0_13","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_22","portletId":"0"},{"nodeId":"n_ioRcv_n_0_13_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_13_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_14":{"id":"n_0_14","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_23","portletId":"0"},{"nodeId":"n_ioRcv_n_0_14_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_14_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_15":{"id":"n_0_15","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_24","portletId":"0"},{"nodeId":"n_ioRcv_n_0_15_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_15_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_16":{"id":"n_0_16","type":"vsl","args":{"minValue":0,"maxValue":127,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_16_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_20","portletId":"0"},{"nodeId":"n_0_21","portletId":"0"},{"nodeId":"n_0_22","portletId":"0"},{"nodeId":"n_0_23","portletId":"0"},{"nodeId":"n_0_24","portletId":"0"},{"nodeId":"n_0_25","portletId":"0"},{"nodeId":"n_ioSnd_n_0_16_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_17":{"id":"n_0_17","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_23","portletId":"0"},{"nodeId":"n_ioRcv_n_0_17_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_17_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_18":{"id":"n_0_18","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_24","portletId":"0"},{"nodeId":"n_ioRcv_n_0_18_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_18_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_19":{"id":"n_0_19","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_25","portletId":"0"},{"nodeId":"n_ioRcv_n_0_19_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_19_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_28":{"id":"n_0_28","type":"nbx","args":{"minValue":-1e+37,"maxValue":1e+37,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_1_3","portletId":"0"},{"nodeId":"n_ioRcv_n_0_28_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_28_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true}},"pdGui":[{"nodeClass":"control","patchId":"0","pdNodeId":"0","nodeId":"n_0_0"},{"nodeClass":"control","patchId":"0","pdNodeId":"1","nodeId":"n_0_1"},{"nodeClass":"subpatch","patchId":"0","pdNodeId":"3","children":[{"nodeClass":"control","patchId":"1","pdNodeId":"1","nodeId":"n_1_1"},{"nodeClass":"control","patchId":"1","pdNodeId":"4","nodeId":"n_1_4"}]},{"nodeClass":"control","patchId":"0","pdNodeId":"4","nodeId":"n_0_4"},{"nodeClass":"control","patchId":"0","pdNodeId":"6","nodeId":"n_0_6"},{"nodeClass":"control","patchId":"0","pdNodeId":"7","nodeId":"n_0_7"},{"nodeClass":"control","patchId":"0","pdNodeId":"8","nodeId":"n_0_8"},{"nodeClass":"control","patchId":"0","pdNodeId":"9","nodeId":"n_0_9"},{"nodeClass":"control","patchId":"0","pdNodeId":"10","nodeId":"n_0_10"},{"nodeClass":"control","patchId":"0","pdNodeId":"11","nodeId":"n_0_11"},{"nodeClass":"control","patchId":"0","pdNodeId":"12","nodeId":"n_0_12"},{"nodeClass":"control","patchId":"0","pdNodeId":"13","nodeId":"n_0_13"},{"nodeClass":"control","patchId":"0","pdNodeId":"14","nodeId":"n_0_14"},{"nodeClass":"control","patchId":"0","pdNodeId":"15","nodeId":"n_0_15"},{"nodeClass":"control","patchId":"0","pdNodeId":"16","nodeId":"n_0_16"},{"nodeClass":"control","patchId":"0","pdNodeId":"17","nodeId":"n_0_17"},{"nodeClass":"control","patchId":"0","pdNodeId":"18","nodeId":"n_0_18"},{"nodeClass":"control","patchId":"0","pdNodeId":"19","nodeId":"n_0_19"},{"nodeClass":"text","patchId":"0","pdNodeId":"26"},{"nodeClass":"text","patchId":"0","pdNodeId":"27"},{"nodeClass":"control","patchId":"0","pdNodeId":"28","nodeId":"n_0_28"},{"nodeClass":"text","patchId":"0","pdNodeId":"29"}]},"settings":{"audio":{"channelCount":{"in":2,"out":2},"bitDepth":64,"sampleRate":0,"blockSize":0},"io":{"messageReceivers":{"n_0_0":["0"],"n_0_1":["0"],"n_1_1":["0"],"n_1_4":["0"],"n_0_4":["0"],"n_0_6":["0"],"n_0_7":["0"],"n_0_8":["0"],"n_0_9":["0"],"n_0_10":["0"],"n_0_11":["0"],"n_0_12":["0"],"n_0_13":["0"],"n_0_14":["0"],"n_0_15":["0"],"n_0_16":["0"],"n_0_17":["0"],"n_0_18":["0"],"n_0_19":["0"],"n_0_28":["0"]},"messageSenders":{"n_0_0":["0"],"n_0_1":["0"],"n_1_1":["0"],"n_1_4":["0"],"n_0_4":["0"],"n_0_6":["0"],"n_0_7":["0"],"n_0_8":["0"],"n_0_9":["0"],"n_0_10":["0"],"n_0_11":["0"],"n_0_12":["0"],"n_0_13":["0"],"n_0_14":["0"],"n_0_15":["0"],"n_0_16":["0"],"n_0_17":["0"],"n_0_18":["0"],"n_0_19":["0"],"n_0_28":["0"]}}},"compilation":{"variableNamesIndex":{"io":{"messageReceivers":{"n_0_0":{"0":"IO_rcv_n_0_0_0"},"n_0_1":{"0":"IO_rcv_n_0_1_0"},"n_1_1":{"0":"IO_rcv_n_1_1_0"},"n_1_4":{"0":"IO_rcv_n_1_4_0"},"n_0_4":{"0":"IO_rcv_n_0_4_0"},"n_0_6":{"0":"IO_rcv_n_0_6_0"},"n_0_7":{"0":"IO_rcv_n_0_7_0"},"n_0_8":{"0":"IO_rcv_n_0_8_0"},"n_0_9":{"0":"IO_rcv_n_0_9_0"},"n_0_10":{"0":"IO_rcv_n_0_10_0"},"n_0_11":{"0":"IO_rcv_n_0_11_0"},"n_0_12":{"0":"IO_rcv_n_0_12_0"},"n_0_13":{"0":"IO_rcv_n_0_13_0"},"n_0_14":{"0":"IO_rcv_n_0_14_0"},"n_0_15":{"0":"IO_rcv_n_0_15_0"},"n_0_16":{"0":"IO_rcv_n_0_16_0"},"n_0_17":{"0":"IO_rcv_n_0_17_0"},"n_0_18":{"0":"IO_rcv_n_0_18_0"},"n_0_19":{"0":"IO_rcv_n_0_19_0"},"n_0_28":{"0":"IO_rcv_n_0_28_0"}},"messageSenders":{"n_0_0":{"0":"IO_snd_n_0_0_0"},"n_0_1":{"0":"IO_snd_n_0_1_0"},"n_1_1":{"0":"IO_snd_n_1_1_0"},"n_1_4":{"0":"IO_snd_n_1_4_0"},"n_0_4":{"0":"IO_snd_n_0_4_0"},"n_0_6":{"0":"IO_snd_n_0_6_0"},"n_0_7":{"0":"IO_snd_n_0_7_0"},"n_0_8":{"0":"IO_snd_n_0_8_0"},"n_0_9":{"0":"IO_snd_n_0_9_0"},"n_0_10":{"0":"IO_snd_n_0_10_0"},"n_0_11":{"0":"IO_snd_n_0_11_0"},"n_0_12":{"0":"IO_snd_n_0_12_0"},"n_0_13":{"0":"IO_snd_n_0_13_0"},"n_0_14":{"0":"IO_snd_n_0_14_0"},"n_0_15":{"0":"IO_snd_n_0_15_0"},"n_0_16":{"0":"IO_snd_n_0_16_0"},"n_0_17":{"0":"IO_snd_n_0_17_0"},"n_0_18":{"0":"IO_snd_n_0_18_0"},"n_0_19":{"0":"IO_snd_n_0_19_0"},"n_0_28":{"0":"IO_snd_n_0_28_0"}}},"globals":{"commons":{"getArray":"G_commons_getArray","setArray":"G_commons_setArray"}}}}},
            initialize: (sampleRate, blockSize) => {
                exports.metadata.settings.audio.sampleRate = sampleRate
                exports.metadata.settings.audio.blockSize = blockSize
                SAMPLE_RATE = sampleRate
                BLOCK_SIZE = blockSize

                
                N_n_0_0_state.messageSender = N_n_ioSnd_n_0_0_0_rcvs_0
                N_n_0_0_state.messageReceiver = function (m) {
                    NT_hsl_receiveMessage(N_n_0_0_state, m)
                }
                NT_hsl_setReceiveBusName(N_n_0_0_state, "empty")
    
                
            


                N_n_0_1_state.messageSender = N_n_ioSnd_n_0_1_0_rcvs_0
                N_n_0_1_state.messageReceiver = function (m) {
                    NT_hradio_receiveMessage(N_n_0_1_state, m)
                }
                NT_hradio_setReceiveBusName(N_n_0_1_state, "empty")
    
                
            


                N_n_0_4_state.messageSender = N_n_ioSnd_n_0_4_0_rcvs_0
                N_n_0_4_state.messageReceiver = function (m) {
                    NT_tgl_receiveMessage(N_n_0_4_state, m)
                }
                NT_tgl_setReceiveBusName(N_n_0_4_state, "empty")
    
                
            


                N_n_0_6_state.messageSender = N_n_ioSnd_n_0_6_0_rcvs_0
                N_n_0_6_state.messageReceiver = function (m) {
                    NT_nbx_receiveMessage(N_n_0_6_state, m)
                }
                NT_nbx_setReceiveBusName(N_n_0_6_state, "empty")
    
                
            


            N_n_0_7_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_7_state, m)
            }
            N_n_0_7_state.messageSender = N_n_ioSnd_n_0_7_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_7_state, "empty")
        


            N_n_0_8_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_8_state, m)
            }
            N_n_0_8_state.messageSender = N_n_ioSnd_n_0_8_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_8_state, "empty")
        


            N_n_0_9_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_9_state, m)
            }
            N_n_0_9_state.messageSender = N_n_ioSnd_n_0_9_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_9_state, "empty")
        


            N_n_0_10_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_10_state, m)
            }
            N_n_0_10_state.messageSender = N_n_ioSnd_n_0_10_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_10_state, "empty")
        


            N_n_0_11_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_11_state, m)
            }
            N_n_0_11_state.messageSender = N_n_ioSnd_n_0_11_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_11_state, "empty")
        


            N_n_0_12_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_12_state, m)
            }
            N_n_0_12_state.messageSender = N_n_ioSnd_n_0_12_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_12_state, "empty")
        


            N_n_0_13_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_13_state, m)
            }
            N_n_0_13_state.messageSender = N_n_ioSnd_n_0_13_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_13_state, "empty")
        


            N_n_0_14_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_14_state, m)
            }
            N_n_0_14_state.messageSender = N_n_ioSnd_n_0_14_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_14_state, "empty")
        


            N_n_0_15_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_15_state, m)
            }
            N_n_0_15_state.messageSender = N_n_ioSnd_n_0_15_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_15_state, "empty")
        


                N_n_0_16_state.messageSender = N_n_0_16_snds_0
                N_n_0_16_state.messageReceiver = function (m) {
                    NT_vsl_receiveMessage(N_n_0_16_state, m)
                }
                NT_vsl_setReceiveBusName(N_n_0_16_state, "empty")
    
                
            

            NT_mul_setLeft(N_n_0_20_state, 0)
            NT_mul_setRight(N_n_0_20_state, 0.05)
        

            NT_mul_setLeft(N_n_0_21_state, 0)
            NT_mul_setRight(N_n_0_21_state, 0.1)
        

            NT_mul_setLeft(N_n_0_22_state, 0)
            NT_mul_setRight(N_n_0_22_state, 0.2)
        

            NT_mul_setLeft(N_n_0_23_state, 0)
            NT_mul_setRight(N_n_0_23_state, 0.4)
        

            N_n_0_17_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_17_state, m)
            }
            N_n_0_17_state.messageSender = N_n_ioSnd_n_0_17_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_17_state, "empty")
        


            NT_mul_setLeft(N_n_0_24_state, 0)
            NT_mul_setRight(N_n_0_24_state, 0.8)
        

            N_n_0_18_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_18_state, m)
            }
            N_n_0_18_state.messageSender = N_n_ioSnd_n_0_18_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_18_state, "empty")
        


            NT_mul_setLeft(N_n_0_25_state, 0)
            NT_mul_setRight(N_n_0_25_state, 1.6)
        

            N_n_0_19_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_19_state, m)
            }
            N_n_0_19_state.messageSender = N_n_ioSnd_n_0_19_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_19_state, "empty")
        



                N_n_0_28_state.messageSender = N_n_ioSnd_n_0_28_0_rcvs_0
                N_n_0_28_state.messageReceiver = function (m) {
                    NT_nbx_receiveMessage(N_n_0_28_state, m)
                }
                NT_nbx_setReceiveBusName(N_n_0_28_state, "empty")
    
                
            


                N_n_1_1_state.messageSender = N_n_1_1_snds_0
                N_n_1_1_state.messageReceiver = function (m) {
                    NT_nbx_receiveMessage(N_n_1_1_state, m)
                }
                NT_nbx_setReceiveBusName(N_n_1_1_state, "empty")
    
                G_commons_waitFrame(0, () => N_n_1_1_snds_0(G_msg_floats([N_n_1_1_state.valueFloat])))
            

            N_n_1_0_state.snd0 = N_n_1_2_rcvs_0
            N_n_1_0_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
            NT_metro_setRate(N_n_1_0_state, 1000)
            N_n_1_0_state.tickCallback = function () {
                NT_metro_scheduleNextTick(N_n_1_0_state)
            }
        

            NT_float_setValue(N_n_1_2_state, 0)
        

            NT_add_setLeft(N_n_1_3_state, 0)
            NT_add_setRight(N_n_1_3_state, 1)
        

            NT_modlegacy_setLeft(N_n_1_5_state, 0)
            NT_modlegacy_setRight(N_n_1_5_state, 4)
        

            NT_add_setLeft(N_n_0_2_state, 0)
            NT_add_setRight(N_n_0_2_state, 1)
        

            NT_eq_setLeft(N_n_0_5_state, 0)
            NT_eq_setRight(N_n_0_5_state, 1)
        


                N_n_1_4_state.messageSender = N_n_1_4_snds_0
                N_n_1_4_state.messageReceiver = function (m) {
                    NT_tgl_receiveMessage(N_n_1_4_state, m)
                }
                NT_tgl_setReceiveBusName(N_n_1_4_state, "empty")
    
                G_commons_waitFrame(0, () => N_n_1_4_snds_0(G_msg_floats([N_n_1_4_state.valueFloat])))
            





















                
            },
            dspLoop: (INPUT, OUTPUT) => {
                
        for (IT_FRAME = 0; IT_FRAME < BLOCK_SIZE; IT_FRAME++) {
            G_commons__emitFrame(FRAME)
            
            FRAME++
        }
    
            },
            io: {
                messageReceivers: {
                    n_0_0: {
                            "0": IO_rcv_n_0_0_0,
                        },
n_0_1: {
                            "0": IO_rcv_n_0_1_0,
                        },
n_1_1: {
                            "0": IO_rcv_n_1_1_0,
                        },
n_1_4: {
                            "0": IO_rcv_n_1_4_0,
                        },
n_0_4: {
                            "0": IO_rcv_n_0_4_0,
                        },
n_0_6: {
                            "0": IO_rcv_n_0_6_0,
                        },
n_0_7: {
                            "0": IO_rcv_n_0_7_0,
                        },
n_0_8: {
                            "0": IO_rcv_n_0_8_0,
                        },
n_0_9: {
                            "0": IO_rcv_n_0_9_0,
                        },
n_0_10: {
                            "0": IO_rcv_n_0_10_0,
                        },
n_0_11: {
                            "0": IO_rcv_n_0_11_0,
                        },
n_0_12: {
                            "0": IO_rcv_n_0_12_0,
                        },
n_0_13: {
                            "0": IO_rcv_n_0_13_0,
                        },
n_0_14: {
                            "0": IO_rcv_n_0_14_0,
                        },
n_0_15: {
                            "0": IO_rcv_n_0_15_0,
                        },
n_0_16: {
                            "0": IO_rcv_n_0_16_0,
                        },
n_0_17: {
                            "0": IO_rcv_n_0_17_0,
                        },
n_0_18: {
                            "0": IO_rcv_n_0_18_0,
                        },
n_0_19: {
                            "0": IO_rcv_n_0_19_0,
                        },
n_0_28: {
                            "0": IO_rcv_n_0_28_0,
                        },
                },
                messageSenders: {
                    n_0_0: {
                            "0": () => undefined,
                        },
n_0_1: {
                            "0": () => undefined,
                        },
n_1_1: {
                            "0": () => undefined,
                        },
n_1_4: {
                            "0": () => undefined,
                        },
n_0_4: {
                            "0": () => undefined,
                        },
n_0_6: {
                            "0": () => undefined,
                        },
n_0_7: {
                            "0": () => undefined,
                        },
n_0_8: {
                            "0": () => undefined,
                        },
n_0_9: {
                            "0": () => undefined,
                        },
n_0_10: {
                            "0": () => undefined,
                        },
n_0_11: {
                            "0": () => undefined,
                        },
n_0_12: {
                            "0": () => undefined,
                        },
n_0_13: {
                            "0": () => undefined,
                        },
n_0_14: {
                            "0": () => undefined,
                        },
n_0_15: {
                            "0": () => undefined,
                        },
n_0_16: {
                            "0": () => undefined,
                        },
n_0_17: {
                            "0": () => undefined,
                        },
n_0_18: {
                            "0": () => undefined,
                        },
n_0_19: {
                            "0": () => undefined,
                        },
n_0_28: {
                            "0": () => undefined,
                        },
                },
            }
        }

        
exports.G_commons_getArray = G_commons_getArray
exports.G_commons_setArray = G_commons_setArray
    