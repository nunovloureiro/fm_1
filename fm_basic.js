
        
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
function G_tokenConversion_toFloat(m, i) {
        if (G_msg_isFloatToken(m, i)) {
            return G_msg_readFloatToken(m, i)
        } else {
            return 0
        }
    }
function G_tokenConversion_toString_(m, i) {
        if (G_msg_isStringToken(m, i)) {
            const str = G_msg_readStringToken(m, i)
            if (str === 'bang') {
                return 'symbol'
            } else {
                return str
            }
        } else {
            return 'float'
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









function NT_delay_setDelay(state, delay) {
                state.delay = Math.max(0, delay)
            }
function NT_delay_scheduleDelay(state, callback, currentFrame) {
                if (state.scheduledBang !== G_sked_ID_NULL) {
                    NT_delay_stop(state)
                }
                state.scheduledBang = G_commons_waitFrame(toInt(
                    Math.round(
                        toFloat(currentFrame) + state.delay * state.sampleRatio)),
                    callback
                )
            }
function NT_delay_stop(state) {
                G_commons_cancelWaitFrame(state.scheduledBang)
                state.scheduledBang = G_sked_ID_NULL
            }





function NT_mul_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_mul_setRight(state, value) {
                    state.rightOp = value
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



function NT_osc_t_setStep(state, freq) {
                    state.step = (2 * Math.PI / SAMPLE_RATE) * freq
                }
function NT_osc_t_setPhase(state, phase) {
                    state.phase = phase % 1.0 * 2 * Math.PI
                }







        const N_n_0_2_state = {
                                minValue: 0,
maxValue: 1,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_tgl_defaultMessageHandler,
messageSender: NT_tgl_defaultMessageHandler,
                            }
const N_m_n_0_0_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_4_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_7_state = {
                                msgSpecs: [],
                            }
const N_m_n_0_6_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_10_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_8_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_14_state = {
                                msgSpecs: [],
                            }
const N_n_0_11_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_15_state = {
                                msgSpecs: [],
                            }
const N_n_0_12_state = {
                                minValue: 0,
maxValue: 10000,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_vsl_defaultMessageHandler,
messageSender: NT_vsl_defaultMessageHandler,
                            }
const N_m_n_0_9_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_8_state = {
                                phase: 0,
step: 0,
                            }
const N_n_0_5_state = {
                                phase: 0,
step: 0,
                            }
        
function N_n_0_2_rcvs_0(m) {
                            
                NT_tgl_receiveMessage(N_n_0_2_state, m)
                return
            
                            throw new Error('Node "n_0_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_0_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_0_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_0_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_0_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_0_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_0_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_2_0_rcvs_0(m) {
                            
                IO_snd_n_0_2_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_2_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_4_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_4_state, 
                            () => N_n_0_13_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_4_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_4_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_4_state,
                        () => N_n_0_13_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_4_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_13_rcvs_0(m) {
                            
            N_n_0_2_rcvs_0(G_bangUtils_bang())
N_n_0_15_rcvs_0(G_bangUtils_bang())
N_n_0_14_rcvs_0(G_bangUtils_bang())
N_n_0_7_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_0_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_7_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_7_state.msgSpecs.splice(0, N_n_0_7_state.msgSpecs.length - 1)
                    N_n_0_7_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_7_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_7_state.msgSpecs.length; i++) {
                        if (N_n_0_7_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_7_state.msgSpecs[i].send, N_n_0_7_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_7_snds_0(N_n_0_7_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_6_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_6_0_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_6_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_6_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_6_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_6_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_10_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_10_state, G_msg_readFloatToken(m, 0))
                        N_m_n_0_8_0__routemsg_rcvs_0(G_msg_floats([N_n_0_10_state.leftOp * N_n_0_10_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_m_n_0_8_0__routemsg_rcvs_0(G_msg_floats([N_n_0_10_state.leftOp * N_n_0_10_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_10", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_10_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_mul_setRight(N_n_0_10_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_10", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_8_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_8_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_8_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_8_0_sig_outs_0 = 0
function N_m_n_0_8_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_8_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_8_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_7_0_rcvs_0(m) {
                            
                IO_snd_n_0_7_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_7_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_14_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_14_state.msgSpecs.splice(0, N_n_0_14_state.msgSpecs.length - 1)
                    N_n_0_14_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_14_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_14_state.msgSpecs.length; i++) {
                        if (N_n_0_14_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_14_state.msgSpecs[i].send, N_n_0_14_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_14_snds_0(N_n_0_14_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_14", inlet "0", unsupported message : ' + G_msg_display(m))
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

function N_n_ioSnd_n_0_14_0_rcvs_0(m) {
                            
                IO_snd_n_0_14_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_14_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_15_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_15_state.msgSpecs.splice(0, N_n_0_15_state.msgSpecs.length - 1)
                    N_n_0_15_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_15_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_15_state.msgSpecs.length; i++) {
                        if (N_n_0_15_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_15_state.msgSpecs[i].send, N_n_0_15_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_15_snds_0(N_n_0_15_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_12_rcvs_0(m) {
                            
                NT_vsl_receiveMessage(N_n_0_12_state, m)
                return
            
                            throw new Error('Node "n_0_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_9_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_9_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_9_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_9_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_9_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_9_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_12_0_rcvs_0(m) {
                            
                IO_snd_n_0_12_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_12_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_15_0_rcvs_0(m) {
                            
                IO_snd_n_0_15_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_15_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }












let N_n_0_8_outs_0 = 0





let N_n_0_5_outs_0 = 0

let N_n_0_0_outs_0 = 0



function N_n_0_2_snds_0(m) {
                        N_m_n_0_0_1__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_2_0_rcvs_0(m)
                    }
function N_n_0_7_snds_0(m) {
                        N_m_n_0_6_0__routemsg_rcvs_0(m)
N_n_0_10_rcvs_0(m)
N_n_ioSnd_n_0_7_0_rcvs_0(m)
                    }
function N_m_n_0_8_0__routemsg_snds_0(m) {
                        N_m_n_0_8_0_sig_rcvs_0(m)
COLD_0(m)
                    }
function N_n_0_14_snds_0(m) {
                        N_n_0_11_rcvs_0(m)
N_n_ioSnd_n_0_14_0_rcvs_0(m)
                    }
function N_n_0_11_snds_0(m) {
                        N_n_0_10_rcvs_1(m)
N_n_ioSnd_n_0_11_0_rcvs_0(m)
                    }
function N_n_0_15_snds_0(m) {
                        N_n_0_12_rcvs_0(m)
N_n_ioSnd_n_0_15_0_rcvs_0(m)
                    }
function N_n_0_12_snds_0(m) {
                        N_m_n_0_9_1__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_12_0_rcvs_0(m)
                    }

        function COLD_0(m) {
                    N_m_n_0_8_0_sig_outs_0 = N_m_n_0_8_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_8_state, N_m_n_0_8_0_sig_outs_0)
                }
        function IO_rcv_n_0_2_0(m) {
                    N_n_0_2_rcvs_0(m)
                }
function IO_rcv_n_0_7_0(m) {
                    N_n_0_7_rcvs_0(m)
                }
function IO_rcv_n_0_11_0(m) {
                    N_n_0_11_rcvs_0(m)
                }
function IO_rcv_n_0_12_0(m) {
                    N_n_0_12_rcvs_0(m)
                }
function IO_rcv_n_0_14_0(m) {
                    N_n_0_14_rcvs_0(m)
                }
function IO_rcv_n_0_15_0(m) {
                    N_n_0_15_rcvs_0(m)
                }
        const IO_snd_n_0_2_0 = (m) => {exports.io.messageSenders['n_0_2']['0'](m)}
const IO_snd_n_0_7_0 = (m) => {exports.io.messageSenders['n_0_7']['0'](m)}
const IO_snd_n_0_11_0 = (m) => {exports.io.messageSenders['n_0_11']['0'](m)}
const IO_snd_n_0_12_0 = (m) => {exports.io.messageSenders['n_0_12']['0'](m)}
const IO_snd_n_0_14_0 = (m) => {exports.io.messageSenders['n_0_14']['0'](m)}
const IO_snd_n_0_15_0 = (m) => {exports.io.messageSenders['n_0_15']['0'](m)}

        const exports = {
            metadata: {"libVersion":"0.1.0","settings":{"audio":{"bitDepth":64,"channelCount":{"in":2,"out":2},"sampleRate":0,"blockSize":0},"io":{"messageReceivers":{"n_0_2":{"portletIds":["0"],"metadata":{"group":"control:float","type":"tgl","label":"","position":[329,342],"initValue":0,"minValue":0,"maxValue":1}},"n_0_7":{"portletIds":["0"],"metadata":{"group":"control","type":"msg","position":[157,127]}},"n_0_11":{"portletIds":["0"],"metadata":{"group":"control:float","type":"floatatom","label":"","position":[214,155]}},"n_0_12":{"portletIds":["0"],"metadata":{"group":"control:float","type":"vsl","label":"","position":[271,157],"initValue":0,"minValue":0,"maxValue":10000}},"n_0_14":{"portletIds":["0"],"metadata":{"group":"control","type":"msg","position":[214,127]}},"n_0_15":{"portletIds":["0"],"metadata":{"group":"control","type":"msg","position":[271,127]}}},"messageSenders":{"n_0_2":{"portletIds":["0"],"metadata":{"group":"control:float","type":"tgl","label":"","position":[329,342],"initValue":0,"minValue":0,"maxValue":1}},"n_0_7":{"portletIds":["0"],"metadata":{"group":"control","type":"msg","position":[157,127]}},"n_0_11":{"portletIds":["0"],"metadata":{"group":"control:float","type":"floatatom","label":"","position":[214,155]}},"n_0_12":{"portletIds":["0"],"metadata":{"group":"control:float","type":"vsl","label":"","position":[271,157],"initValue":0,"minValue":0,"maxValue":10000}},"n_0_14":{"portletIds":["0"],"metadata":{"group":"control","type":"msg","position":[214,127]}},"n_0_15":{"portletIds":["0"],"metadata":{"group":"control","type":"msg","position":[271,127]}}}}},"compilation":{"variableNamesIndex":{"io":{"messageReceivers":{"n_0_2":{"0":"IO_rcv_n_0_2_0"},"n_0_7":{"0":"IO_rcv_n_0_7_0"},"n_0_11":{"0":"IO_rcv_n_0_11_0"},"n_0_12":{"0":"IO_rcv_n_0_12_0"},"n_0_14":{"0":"IO_rcv_n_0_14_0"},"n_0_15":{"0":"IO_rcv_n_0_15_0"}},"messageSenders":{"n_0_2":{"0":"IO_snd_n_0_2_0"},"n_0_7":{"0":"IO_snd_n_0_7_0"},"n_0_11":{"0":"IO_snd_n_0_11_0"},"n_0_12":{"0":"IO_snd_n_0_12_0"},"n_0_14":{"0":"IO_snd_n_0_14_0"},"n_0_15":{"0":"IO_snd_n_0_15_0"}}},"globals":{"commons":{"getArray":"G_commons_getArray","setArray":"G_commons_setArray"}}}}},
            initialize: (sampleRate, blockSize) => {
                exports.metadata.settings.audio.sampleRate = sampleRate
                exports.metadata.settings.audio.blockSize = blockSize
                SAMPLE_RATE = sampleRate
                BLOCK_SIZE = blockSize

                
                N_n_0_2_state.messageSender = N_n_0_2_snds_0
                N_n_0_2_state.messageReceiver = function (m) {
                    NT_tgl_receiveMessage(N_n_0_2_state, m)
                }
                NT_tgl_setReceiveBusName(N_n_0_2_state, "empty")
    
                
            



G_commons_waitFrame(0, () => N_n_0_4_rcvs_0(G_bangUtils_bang()))

        N_n_0_4_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_4_state, 10)
    


            N_n_0_7_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_7_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_7_state.msgSpecs[0].outTemplate = []

                N_n_0_7_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_7_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_7_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_7_state.msgSpecs[0].outMessage, 0, 220)
            
        



            NT_mul_setLeft(N_n_0_10_state, 0)
            NT_mul_setRight(N_n_0_10_state, 1)
        




            N_n_0_14_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_14_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_14_state.msgSpecs[0].outTemplate = []

                N_n_0_14_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_14_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_14_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_14_state.msgSpecs[0].outMessage, 0, 1.27)
            
        

            N_n_0_11_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_11_state, m)
            }
            N_n_0_11_state.messageSender = N_n_0_11_snds_0
            NT_floatatom_setReceiveBusName(N_n_0_11_state, "empty")
        



            N_n_0_15_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_15_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_15_state.msgSpecs[0].outTemplate = []

                N_n_0_15_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_15_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_15_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_15_state.msgSpecs[0].outMessage, 0, 2000)
            
        

                N_n_0_12_state.messageSender = N_n_0_12_snds_0
                N_n_0_12_state.messageReceiver = function (m) {
                    NT_vsl_receiveMessage(N_n_0_12_state, m)
                }
                NT_vsl_setReceiveBusName(N_n_0_12_state, "empty")
    
                
            











            NT_osc_t_setStep(N_n_0_8_state, 0)
        



            NT_osc_t_setStep(N_n_0_5_state, 0)
        


                COLD_0(G_msg_EMPTY_MESSAGE)
            },
            dspLoop: (INPUT, OUTPUT) => {
                
        for (IT_FRAME = 0; IT_FRAME < BLOCK_SIZE; IT_FRAME++) {
            G_commons__emitFrame(FRAME)
            
                N_n_0_8_outs_0 = Math.cos(N_n_0_8_state.phase)
                N_n_0_8_state.phase += N_n_0_8_state.step
            
NT_osc_t_setStep(N_n_0_5_state, ((N_m_n_0_6_0_sig_state.currentValue) + (N_n_0_8_outs_0 * (N_m_n_0_9_1_sig_state.currentValue))))

                N_n_0_5_outs_0 = Math.cos(N_n_0_5_state.phase)
                N_n_0_5_state.phase += N_n_0_5_state.step
            
N_n_0_0_outs_0 = N_n_0_5_outs_0 * (N_m_n_0_0_1_sig_state.currentValue)
OUTPUT[0][IT_FRAME] = N_n_0_0_outs_0
OUTPUT[1][IT_FRAME] = N_n_0_0_outs_0
            FRAME++
        }
    
            },
            io: {
                messageReceivers: {
                    n_0_2: {
                            "0": IO_rcv_n_0_2_0,
                        },
n_0_7: {
                            "0": IO_rcv_n_0_7_0,
                        },
n_0_11: {
                            "0": IO_rcv_n_0_11_0,
                        },
n_0_12: {
                            "0": IO_rcv_n_0_12_0,
                        },
n_0_14: {
                            "0": IO_rcv_n_0_14_0,
                        },
n_0_15: {
                            "0": IO_rcv_n_0_15_0,
                        },
                },
                messageSenders: {
                    n_0_2: {
                            "0": () => undefined,
                        },
n_0_7: {
                            "0": () => undefined,
                        },
n_0_11: {
                            "0": () => undefined,
                        },
n_0_12: {
                            "0": () => undefined,
                        },
n_0_14: {
                            "0": () => undefined,
                        },
n_0_15: {
                            "0": () => undefined,
                        },
                },
            }
        }

        
exports.G_commons_getArray = G_commons_getArray
exports.G_commons_setArray = G_commons_setArray
    