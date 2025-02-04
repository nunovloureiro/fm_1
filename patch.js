
        
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
function G_actionUtils_isAction(message, action) {
            return G_msg_isMatching(message, [G_msg_STRING_TOKEN])
                && G_msg_readStringToken(message, 0) === action
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

function G_points_interpolateLin(x, p0, p1) {
        return p0.y + (x - p0.x) * (p1.y - p0.y) / (p1.x - p0.x)
    }

function G_linesUtils_computeSlope(p0, p1) {
            return p1.x !== p0.x ? (p1.y - p0.y) / (p1.x - p0.x) : 0
        }
function G_linesUtils_removePointsBeforeFrame(points, frame) {
            const newPoints = []
            let i = 0
            while (i < points.length) {
                if (frame <= points[i].x) {
                    newPoints.push(points[i])
                }
                i++
            }
            return newPoints
        }
function G_linesUtils_insertNewLinePoints(points, p0, p1) {
            const newPoints = []
            let i = 0
            
            // Keep the points that are before the new points added
            while (i < points.length && points[i].x <= p0.x) {
                newPoints.push(points[i])
                i++
            }
            
            // Find the start value of the start point :
            
            // 1. If there is a previous point and that previous point
            // is on the same frame, we don't modify the start point value.
            // (represents a vertical line).
            if (0 < i - 1 && points[i - 1].x === p0.x) {

            // 2. If new points are inserted in between already existing points 
            // we need to interpolate the existing line to find the startValue.
            } else if (0 < i && i < points.length) {
                newPoints.push({
                    x: p0.x,
                    y: G_points_interpolateLin(p0.x, points[i - 1], points[i])
                })

            // 3. If new line is inserted after all existing points, 
            // we just take the value of the last point
            } else if (i >= points.length && points.length) {
                newPoints.push({
                    x: p0.x,
                    y: points[points.length - 1].y,
                })

            // 4. If new line placed in first position, we take the defaultStartValue.
            } else if (i === 0) {
                newPoints.push({
                    x: p0.x,
                    y: p0.y,
                })
            }
            
            newPoints.push({
                x: p1.x,
                y: p1.y,
            })
            return newPoints
        }
function G_linesUtils_computeFrameAjustedPoints(points) {
            if (points.length < 2) {
                throw new Error('invalid length for points')
            }

            const newPoints = []
            let i = 0
            let p = points[0]
            let frameLower = 0
            let frameUpper = 0
            
            while(i < points.length) {
                p = points[i]
                frameLower = Math.floor(p.x)
                frameUpper = frameLower + 1

                // I. Placing interpolated point at the lower bound of the current frame
                // ------------------------------------------------------------------------
                // 1. Point is already on an exact frame,
                if (p.x === frameLower) {
                    newPoints.push({ x: p.x, y: p.y })

                    // 1.a. if several of the next points are also on the same X,
                    // we find the last one to draw a vertical line.
                    while (
                        (i + 1) < points.length
                        && points[i + 1].x === frameLower
                    ) {
                        i++
                    }
                    if (points[i].y !== newPoints[newPoints.length - 1].y) {
                        newPoints.push({ x: points[i].x, y: points[i].y })
                    }

                    // 1.b. if last point, we quit
                    if (i + 1 >= points.length) {
                        break
                    }

                    // 1.c. if next point is in a different frame we can move on to next iteration
                    if (frameUpper <= points[i + 1].x) {
                        i++
                        continue
                    }
                
                // 2. Point isn't on an exact frame
                // 2.a. There's a previous point, the we use it to interpolate the value.
                } else if (newPoints.length) {
                    newPoints.push({
                        x: frameLower,
                        y: G_points_interpolateLin(frameLower, points[i - 1], p),
                    })
                
                // 2.b. It's the very first point, then we don't change its value.
                } else {
                    newPoints.push({ x: frameLower, y: p.y })
                }

                // II. Placing interpolated point at the upper bound of the current frame
                // ---------------------------------------------------------------------------
                // First, we find the closest point from the frame upper bound (could be the same p).
                // Or could be a point that is exactly placed on frameUpper.
                while (
                    (i + 1) < points.length 
                    && (
                        Math.ceil(points[i + 1].x) === frameUpper
                        || Math.floor(points[i + 1].x) === frameUpper
                    )
                ) {
                    i++
                }
                p = points[i]

                // 1. If the next point is directly in the next frame, 
                // we do nothing, as this corresponds with next iteration frameLower.
                if (Math.floor(p.x) === frameUpper) {
                    continue
                
                // 2. If there's still a point after p, we use it to interpolate the value
                } else if (i < points.length - 1) {
                    newPoints.push({
                        x: frameUpper,
                        y: G_points_interpolateLin(frameUpper, p, points[i + 1]),
                    })

                // 3. If it's the last point, we dont change the value
                } else {
                    newPoints.push({ x: frameUpper, y: p.y })
                }

                i++
            }

            return newPoints
        }
function G_linesUtils_computeLineSegments(points) {
            const lineSegments = []
            let i = 0
            let p0
            let p1

            while(i < points.length - 1) {
                p0 = points[i]
                p1 = points[i + 1]
                lineSegments.push({
                    p0, p1, 
                    dy: G_linesUtils_computeSlope(p0, p1),
                    dx: 1,
                })
                i++
            }
            return lineSegments
        }
function G_numbers_roundFloatAsPdInt(value) {
            return value > 0 ? Math.floor(value): Math.ceil(value)
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
        






function NT_line_setNewLine(state, targetValue) {
                state.currentLine = {
                    p0: {
                        x: toFloat(FRAME), 
                        y: state.currentValue,
                    }, 
                    p1: {
                        x: toFloat(FRAME) + state.nextDurationSamp, 
                        y: targetValue,
                    }, 
                    dx: state.grainSamp
                }
                state.nextDurationSamp = 0
                state.currentLine.dy = G_linesUtils_computeSlope(state.currentLine.p0, state.currentLine.p1) * state.grainSamp
            }
function NT_line_setNextDuration(state, durationMsec) {
                state.nextDurationSamp = computeUnitInSamples(SAMPLE_RATE, durationMsec, 'msec')
            }
function NT_line_setGrain(state, grainMsec) {
                state.grainSamp = computeUnitInSamples(SAMPLE_RATE, Math.max(grainMsec, 20), 'msec')
            }
function NT_line_stopCurrentLine(state) {
                if (state.skedId !== G_sked_ID_NULL) {
                    G_commons_cancelWaitFrame(state.skedId)
                    state.skedId = G_sked_ID_NULL
                }
                if (FRAME < state.nextSampInt) {
                    NT_line_incrementTime(state, -1 * (state.nextSamp - toFloat(FRAME)))
                }
                NT_line_setNextSamp(state, -1)
            }
function NT_line_setNextSamp(state, currentSamp) {
                state.nextSamp = currentSamp
                state.nextSampInt = toInt(Math.round(currentSamp))
            }
function NT_line_incrementTime(state, incrementSamp) {
                if (incrementSamp === state.currentLine.dx) {
                    state.currentValue += state.currentLine.dy
                } else {
                    state.currentValue += G_points_interpolateLin(
                        incrementSamp,
                        {x: 0, y: 0},
                        {x: state.currentLine.dx, y: state.currentLine.dy},
                    )
                }
                NT_line_setNextSamp(
                    state, 
                    (state.nextSamp !== -1 ? state.nextSamp: toFloat(FRAME)) + incrementSamp
                )
            }
function NT_line_tick(state) {
                state.snd0(G_msg_floats([state.currentValue]))
                if (toFloat(FRAME) >= state.currentLine.p1.x) {
                    state.currentValue = state.currentLine.p1.y
                    NT_line_stopCurrentLine(state)
                } else {
                    NT_line_incrementTime(state, state.currentLine.dx)
                    NT_line_scheduleNextTick(state)
                }
            }
function NT_line_scheduleNextTick(state) {
                state.skedId = G_commons_waitFrame(state.nextSampInt, state.tickCallback)
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

function NT_int_setValue(state, value) {
                state.value = G_numbers_roundFloatAsPdInt(value)
            }





function NT_lop_t_setFreq(state, freq) {
                state.coeff = Math.max(Math.min(freq * 2 * Math.PI / SAMPLE_RATE, 1), 0)
            }

function NT_osc_t_setStep(state, freq) {
                    state.step = (2 * Math.PI / SAMPLE_RATE) * freq
                }
function NT_osc_t_setPhase(state, phase) {
                    state.phase = phase % 1.0 * 2 * Math.PI
                }







        const N_n_0_3_state = {
                                msgSpecs: [],
                            }
const N_n_0_5_state = {
                                currentLine: {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            },
currentValue: 0,
nextSamp: -1,
nextSampInt: -1,
grainSamp: 0,
nextDurationSamp: 0,
skedId: G_sked_ID_NULL,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_m_n_0_6_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_8_state = {
                                minValue: 0,
maxValue: 1,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_hsl_defaultMessageHandler,
messageSender: NT_hsl_defaultMessageHandler,
                            }
const N_n_0_7_state = {
                                msgSpecs: [],
                            }
const N_n_0_9_state = {
                                minValue: 0,
maxValue: 4,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_hsl_defaultMessageHandler,
messageSender: NT_hsl_defaultMessageHandler,
                            }
const N_n_0_15_state = {
                                value: 0,
                            }
const N_n_0_11_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_10_state = {
                                msgSpecs: [],
                            }
const N_n_0_16_state = {
                                currentLine: {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            },
currentValue: 0,
nextSamp: -1,
nextSampInt: -1,
grainSamp: 0,
nextDurationSamp: 0,
skedId: G_sked_ID_NULL,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_m_n_0_17_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_12_state = {
                                msgSpecs: [],
                            }
const N_n_0_13_state = {
                                msgSpecs: [],
                            }
const N_n_0_14_state = {
                                msgSpecs: [],
                            }
const N_m_n_0_17_1_sig_state = {
                                currentValue: 2,
                            }
const N_n_0_17_state = {
                                previous: 0,
coeff: 0,
                            }
const N_n_0_1_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_0_6_1_sig_state = {
                                currentValue: 1,
                            }
const N_n_0_6_state = {
                                previous: 0,
coeff: 0,
                            }
const N_n_0_18_state = {
                                minValue: 0,
maxValue: 0.95,
                            }
        


function N_n_0_3_rcvs_0(m) {
                            
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

                    N_n_0_3_state.msgSpecs.splice(0, N_n_0_3_state.msgSpecs.length - 1)
                    N_n_0_3_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_3_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_3_state.msgSpecs.length; i++) {
                        if (N_n_0_3_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_3_state.msgSpecs[i].send, N_n_0_3_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_ioSnd_n_0_3_0_rcvs_0(N_n_0_3_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_3_0_rcvs_0(m) {
                            
                IO_snd_n_0_3_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_3_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_5_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                NT_line_stopCurrentLine(N_n_0_5_state)
                switch (G_msg_getLength(m)) {
                    case 3:
                        NT_line_setGrain(N_n_0_5_state, G_msg_readFloatToken(m, 2))
                    case 2:
                        NT_line_setNextDuration(N_n_0_5_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        const targetValue = G_msg_readFloatToken(m, 0)
                        if (N_n_0_5_state.nextDurationSamp === 0) {
                            N_n_0_5_state.currentValue = targetValue
                            N_m_n_0_6_0__routemsg_rcvs_0(G_msg_floats([targetValue]))
                        } else {
                            N_m_n_0_6_0__routemsg_rcvs_0(G_msg_floats([N_n_0_5_state.currentValue]))
                            NT_line_setNewLine(N_n_0_5_state, targetValue)
                            NT_line_incrementTime(N_n_0_5_state, N_n_0_5_state.currentLine.dx)
                            NT_line_scheduleNextTick(N_n_0_5_state)
                        }
                        
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_stopCurrentLine(N_n_0_5_state)
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_line_stopCurrentLine(N_n_0_5_state)
                N_n_0_5_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_6_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_6_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_6_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_6_0_sig_outs_0 = 0
function N_m_n_0_6_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_6_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_6_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_8_rcvs_0(m) {
                            
                NT_hsl_receiveMessage(N_n_0_8_state, m)
                return
            
                            throw new Error('Node "n_0_8", inlet "0", unsupported message : ' + G_msg_display(m))
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

function N_n_ioSnd_n_0_7_0_rcvs_0(m) {
                            
                IO_snd_n_0_7_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_7_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_8_0_rcvs_0(m) {
                            
                IO_snd_n_0_8_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_8_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_9_rcvs_0(m) {
                            
                NT_hsl_receiveMessage(N_n_0_9_state, m)
                return
            
                            throw new Error('Node "n_0_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_15_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_15_state, G_msg_readFloatToken(m, 0))
                N_n_0_11_rcvs_0(G_msg_floats([N_n_0_15_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_11_rcvs_0(G_msg_floats([N_n_0_15_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_11_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_0_10_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_12_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_13_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_0_14_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_10_rcvs_0(m) {
                            
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

                    N_n_0_10_state.msgSpecs.splice(0, N_n_0_10_state.msgSpecs.length - 1)
                    N_n_0_10_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_10_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_10_state.msgSpecs.length; i++) {
                        if (N_n_0_10_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_10_state.msgSpecs[i].send, N_n_0_10_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_10_snds_0(N_n_0_10_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_10", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_16_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                NT_line_stopCurrentLine(N_n_0_16_state)
                switch (G_msg_getLength(m)) {
                    case 3:
                        NT_line_setGrain(N_n_0_16_state, G_msg_readFloatToken(m, 2))
                    case 2:
                        NT_line_setNextDuration(N_n_0_16_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        const targetValue = G_msg_readFloatToken(m, 0)
                        if (N_n_0_16_state.nextDurationSamp === 0) {
                            N_n_0_16_state.currentValue = targetValue
                            N_m_n_0_17_0__routemsg_rcvs_0(G_msg_floats([targetValue]))
                        } else {
                            N_m_n_0_17_0__routemsg_rcvs_0(G_msg_floats([N_n_0_16_state.currentValue]))
                            NT_line_setNewLine(N_n_0_16_state, targetValue)
                            NT_line_incrementTime(N_n_0_16_state, N_n_0_16_state.currentLine.dx)
                            NT_line_scheduleNextTick(N_n_0_16_state)
                        }
                        
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_stopCurrentLine(N_n_0_16_state)
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_line_stopCurrentLine(N_n_0_16_state)
                N_n_0_16_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_17_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_17_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_17_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_17_0_sig_outs_0 = 0
function N_m_n_0_17_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_17_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_17_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_10_0_rcvs_0(m) {
                            
                IO_snd_n_0_10_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_10_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_12_rcvs_0(m) {
                            
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

                    N_n_0_12_state.msgSpecs.splice(0, N_n_0_12_state.msgSpecs.length - 1)
                    N_n_0_12_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_12_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_12_state.msgSpecs.length; i++) {
                        if (N_n_0_12_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_12_state.msgSpecs[i].send, N_n_0_12_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_12_snds_0(N_n_0_12_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_12_0_rcvs_0(m) {
                            
                IO_snd_n_0_12_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_12_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_13_rcvs_0(m) {
                            
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

                    N_n_0_13_state.msgSpecs.splice(0, N_n_0_13_state.msgSpecs.length - 1)
                    N_n_0_13_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_13_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_13_state.msgSpecs.length; i++) {
                        if (N_n_0_13_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_13_state.msgSpecs[i].send, N_n_0_13_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_13_snds_0(N_n_0_13_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_13_0_rcvs_0(m) {
                            
                IO_snd_n_0_13_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_13_0", inlet "0", unsupported message : ' + G_msg_display(m))
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

function N_n_ioSnd_n_0_14_0_rcvs_0(m) {
                            
                IO_snd_n_0_14_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_14_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_9_0_rcvs_0(m) {
                            
                IO_snd_n_0_9_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_9_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
















let N_m_n_0_17_1_sig_outs_0 = 0

let N_n_0_17_outs_0 = 0

let N_n_0_1_outs_0 = 0

let N_m_n_0_6_1_sig_outs_0 = 0

let N_n_0_6_outs_0 = 0



let N_n_0_4_outs_0 = 0



function N_m_n_0_6_0__routemsg_snds_0(m) {
                        N_m_n_0_6_0_sig_rcvs_0(m)
COLD_2(m)
                    }
function N_n_0_8_snds_0(m) {
                        N_n_0_7_rcvs_0(m)
N_n_ioSnd_n_0_8_0_rcvs_0(m)
                    }
function N_n_0_7_snds_0(m) {
                        N_n_0_5_rcvs_0(m)
N_n_ioSnd_n_0_7_0_rcvs_0(m)
                    }
function N_n_0_9_snds_0(m) {
                        N_n_0_15_rcvs_0(m)
N_n_ioSnd_n_0_9_0_rcvs_0(m)
                    }
function N_n_0_10_snds_0(m) {
                        N_n_0_16_rcvs_0(m)
N_n_ioSnd_n_0_10_0_rcvs_0(m)
                    }
function N_m_n_0_17_0__routemsg_snds_0(m) {
                        N_m_n_0_17_0_sig_rcvs_0(m)
COLD_0(m)
                    }
function N_n_0_12_snds_0(m) {
                        N_n_0_16_rcvs_0(m)
N_n_ioSnd_n_0_12_0_rcvs_0(m)
                    }
function N_n_0_13_snds_0(m) {
                        N_n_0_16_rcvs_0(m)
N_n_ioSnd_n_0_13_0_rcvs_0(m)
                    }
function N_n_0_14_snds_0(m) {
                        N_n_0_16_rcvs_0(m)
N_n_ioSnd_n_0_14_0_rcvs_0(m)
                    }

        function COLD_0(m) {
                    N_m_n_0_17_0_sig_outs_0 = N_m_n_0_17_0_sig_state.currentValue
                    
                }
function COLD_1(m) {
                    N_m_n_0_17_1_sig_outs_0 = N_m_n_0_17_1_sig_state.currentValue
                    NT_lop_t_setFreq(N_n_0_17_state, N_m_n_0_17_1_sig_outs_0)
                }
function COLD_2(m) {
                    N_m_n_0_6_0_sig_outs_0 = N_m_n_0_6_0_sig_state.currentValue
                    
                }
function COLD_3(m) {
                    N_m_n_0_6_1_sig_outs_0 = N_m_n_0_6_1_sig_state.currentValue
                    NT_lop_t_setFreq(N_n_0_6_state, N_m_n_0_6_1_sig_outs_0)
                }
        function IO_rcv_n_0_3_0(m) {
                    N_n_0_3_rcvs_0(m)
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
function IO_rcv_n_0_12_0(m) {
                    N_n_0_12_rcvs_0(m)
                }
function IO_rcv_n_0_13_0(m) {
                    N_n_0_13_rcvs_0(m)
                }
function IO_rcv_n_0_14_0(m) {
                    N_n_0_14_rcvs_0(m)
                }
        const IO_snd_n_0_3_0 = (m) => {exports.io.messageSenders['n_0_3']['0'](m)}
const IO_snd_n_0_7_0 = (m) => {exports.io.messageSenders['n_0_7']['0'](m)}
const IO_snd_n_0_8_0 = (m) => {exports.io.messageSenders['n_0_8']['0'](m)}
const IO_snd_n_0_9_0 = (m) => {exports.io.messageSenders['n_0_9']['0'](m)}
const IO_snd_n_0_10_0 = (m) => {exports.io.messageSenders['n_0_10']['0'](m)}
const IO_snd_n_0_12_0 = (m) => {exports.io.messageSenders['n_0_12']['0'](m)}
const IO_snd_n_0_13_0 = (m) => {exports.io.messageSenders['n_0_13']['0'](m)}
const IO_snd_n_0_14_0 = (m) => {exports.io.messageSenders['n_0_14']['0'](m)}

        const exports = {
            metadata: {"libVersion":"0.1.0","customMetadata":{"pdNodes":{"0":{"3":{"id":"3","type":"msg","args":[";","pd","dsp",1],"nodeClass":"control","layout":{"x":206,"y":61}},"7":{"id":"7","type":"msg","args":["$1",30],"nodeClass":"control","layout":{"x":144,"y":173}},"8":{"id":"8","type":"hsl","args":[0,1,0,0,"",""],"nodeClass":"control","layout":{"x":146,"y":147,"width":162,"height":19,"log":0,"label":"vol","labelX":-2,"labelY":-10,"labelFont":"0","labelFontSize":12,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000","steadyOnClick":"1"}},"9":{"id":"9","type":"hsl","args":[0,4,0,0,"",""],"nodeClass":"control","layout":{"x":50,"y":12,"width":162,"height":19,"log":0,"label":"note","labelX":-2,"labelY":-10,"labelFont":"0","labelFontSize":12,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000","steadyOnClick":"1"}},"10":{"id":"10","type":"msg","args":[110],"nodeClass":"control","layout":{"x":47,"y":85}},"12":{"id":"12","type":"msg","args":[220],"nodeClass":"control","layout":{"x":65,"y":109}},"13":{"id":"13","type":"msg","args":[440],"nodeClass":"control","layout":{"x":84,"y":86}},"14":{"id":"14","type":"msg","args":[880],"nodeClass":"control","layout":{"x":102,"y":110}}}},"graph":{"n_0_3":{"id":"n_0_3","type":"msg","args":{"msgSpecs":[{"tokens":["dsp",1],"send":"pd"}]},"sources":{"0":[{"nodeId":"n_0_2","portletId":"0"},{"nodeId":"n_ioRcv_n_0_3_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_3_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_7":{"id":"n_0_7","type":"msg","args":{"msgSpecs":[{"tokens":["$1",30],"send":null}]},"sources":{"0":[{"nodeId":"n_0_8","portletId":"0"},{"nodeId":"n_ioRcv_n_0_7_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_5","portletId":"0"},{"nodeId":"n_ioSnd_n_0_7_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_8":{"id":"n_0_8","type":"hsl","args":{"minValue":0,"maxValue":1,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_8_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_7","portletId":"0"},{"nodeId":"n_ioSnd_n_0_8_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_9":{"id":"n_0_9","type":"hsl","args":{"minValue":0,"maxValue":4,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_9_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_9_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_10":{"id":"n_0_10","type":"msg","args":{"msgSpecs":[{"tokens":[110],"send":null}]},"sources":{"0":[{"nodeId":"n_0_11","portletId":"0"},{"nodeId":"n_ioRcv_n_0_10_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_16","portletId":"0"},{"nodeId":"n_ioSnd_n_0_10_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_12":{"id":"n_0_12","type":"msg","args":{"msgSpecs":[{"tokens":[220],"send":null}]},"sources":{"0":[{"nodeId":"n_0_11","portletId":"1"},{"nodeId":"n_ioRcv_n_0_12_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_16","portletId":"0"},{"nodeId":"n_ioSnd_n_0_12_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_13":{"id":"n_0_13","type":"msg","args":{"msgSpecs":[{"tokens":[440],"send":null}]},"sources":{"0":[{"nodeId":"n_0_11","portletId":"2"},{"nodeId":"n_ioRcv_n_0_13_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_16","portletId":"0"},{"nodeId":"n_ioSnd_n_0_13_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_14":{"id":"n_0_14","type":"msg","args":{"msgSpecs":[{"tokens":[880],"send":null}]},"sources":{"0":[{"nodeId":"n_0_11","portletId":"3"},{"nodeId":"n_ioRcv_n_0_14_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_16","portletId":"0"},{"nodeId":"n_ioSnd_n_0_14_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}}},"pdGui":[{"nodeClass":"control","patchId":"0","pdNodeId":"3","nodeId":"n_0_3"},{"nodeClass":"control","patchId":"0","pdNodeId":"7","nodeId":"n_0_7"},{"nodeClass":"control","patchId":"0","pdNodeId":"8","nodeId":"n_0_8"},{"nodeClass":"control","patchId":"0","pdNodeId":"9","nodeId":"n_0_9"},{"nodeClass":"control","patchId":"0","pdNodeId":"10","nodeId":"n_0_10"},{"nodeClass":"control","patchId":"0","pdNodeId":"12","nodeId":"n_0_12"},{"nodeClass":"control","patchId":"0","pdNodeId":"13","nodeId":"n_0_13"},{"nodeClass":"control","patchId":"0","pdNodeId":"14","nodeId":"n_0_14"}]},"settings":{"audio":{"channelCount":{"in":2,"out":2},"bitDepth":64,"sampleRate":0,"blockSize":0},"io":{"messageReceivers":{"n_0_3":["0"],"n_0_7":["0"],"n_0_8":["0"],"n_0_9":["0"],"n_0_10":["0"],"n_0_12":["0"],"n_0_13":["0"],"n_0_14":["0"]},"messageSenders":{"n_0_3":["0"],"n_0_7":["0"],"n_0_8":["0"],"n_0_9":["0"],"n_0_10":["0"],"n_0_12":["0"],"n_0_13":["0"],"n_0_14":["0"]}}},"compilation":{"variableNamesIndex":{"io":{"messageReceivers":{"n_0_3":{"0":"IO_rcv_n_0_3_0"},"n_0_7":{"0":"IO_rcv_n_0_7_0"},"n_0_8":{"0":"IO_rcv_n_0_8_0"},"n_0_9":{"0":"IO_rcv_n_0_9_0"},"n_0_10":{"0":"IO_rcv_n_0_10_0"},"n_0_12":{"0":"IO_rcv_n_0_12_0"},"n_0_13":{"0":"IO_rcv_n_0_13_0"},"n_0_14":{"0":"IO_rcv_n_0_14_0"}},"messageSenders":{"n_0_3":{"0":"IO_snd_n_0_3_0"},"n_0_7":{"0":"IO_snd_n_0_7_0"},"n_0_8":{"0":"IO_snd_n_0_8_0"},"n_0_9":{"0":"IO_snd_n_0_9_0"},"n_0_10":{"0":"IO_snd_n_0_10_0"},"n_0_12":{"0":"IO_snd_n_0_12_0"},"n_0_13":{"0":"IO_snd_n_0_13_0"},"n_0_14":{"0":"IO_snd_n_0_14_0"}}},"globals":{"commons":{"getArray":"G_commons_getArray","setArray":"G_commons_setArray"}}}}},
            initialize: (sampleRate, blockSize) => {
                exports.metadata.settings.audio.sampleRate = sampleRate
                exports.metadata.settings.audio.blockSize = blockSize
                SAMPLE_RATE = sampleRate
                BLOCK_SIZE = blockSize

                G_commons_waitFrame(0, () => N_n_0_3_rcvs_0(G_bangUtils_bang()))

            N_n_0_3_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_3_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "pd",
                        hasSend: true,
                    },
            ]

            
        
        
        
    
N_n_0_3_state.msgSpecs[0].outTemplate = []

                N_n_0_3_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_3_state.msgSpecs[0].outTemplate.push(3)
            

                N_n_0_3_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_3_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_3_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_0_3_state.msgSpecs[0].outMessage, 0, "dsp")
            

                G_msg_writeFloatToken(N_n_0_3_state.msgSpecs[0].outMessage, 1, 1)
            
        


            NT_line_setGrain(N_n_0_5_state, 20)
            N_n_0_5_state.snd0 = N_m_n_0_6_0__routemsg_rcvs_0
            N_n_0_5_state.tickCallback = function () {
                NT_line_tick(N_n_0_5_state)
            }
        



                N_n_0_8_state.messageSender = N_n_0_8_snds_0
                N_n_0_8_state.messageReceiver = function (m) {
                    NT_hsl_receiveMessage(N_n_0_8_state, m)
                }
                NT_hsl_setReceiveBusName(N_n_0_8_state, "empty")
    
                
            

            N_n_0_7_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_0_7_state.msgSpecs[0].outTemplate = []

                N_n_0_7_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_0_7_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            

                N_n_0_7_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_7_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_7_state.msgSpecs[0].outTemplate)

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_0_7_state.msgSpecs[0].outMessage, 0, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_0_7_state.msgSpecs[0].outMessage, 0, stringMem[0])
                }
            

                G_msg_writeFloatToken(N_n_0_7_state.msgSpecs[0].outMessage, 1, 30)
            
                            return N_n_0_7_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        



                N_n_0_9_state.messageSender = N_n_0_9_snds_0
                N_n_0_9_state.messageReceiver = function (m) {
                    NT_hsl_receiveMessage(N_n_0_9_state, m)
                }
                NT_hsl_setReceiveBusName(N_n_0_9_state, "empty")
    
                
            

            NT_int_setValue(N_n_0_15_state, 0)
        


            N_n_0_10_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_10_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_10_state.msgSpecs[0].outTemplate = []

                N_n_0_10_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_10_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_10_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_10_state.msgSpecs[0].outMessage, 0, 110)
            
        

            NT_line_setGrain(N_n_0_16_state, 20)
            N_n_0_16_state.snd0 = N_m_n_0_17_0__routemsg_rcvs_0
            N_n_0_16_state.tickCallback = function () {
                NT_line_tick(N_n_0_16_state)
            }
        




            N_n_0_12_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_12_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_12_state.msgSpecs[0].outTemplate = []

                N_n_0_12_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_12_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_12_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_12_state.msgSpecs[0].outMessage, 0, 220)
            
        


            N_n_0_13_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_13_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_13_state.msgSpecs[0].outTemplate = []

                N_n_0_13_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_13_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_13_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_13_state.msgSpecs[0].outMessage, 0, 440)
            
        


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

                G_msg_writeFloatToken(N_n_0_14_state.msgSpecs[0].outMessage, 0, 880)
            
        













            NT_osc_t_setStep(N_n_0_1_state, 0)
        





                COLD_0(G_msg_EMPTY_MESSAGE)
COLD_1(G_msg_EMPTY_MESSAGE)
COLD_2(G_msg_EMPTY_MESSAGE)
COLD_3(G_msg_EMPTY_MESSAGE)
            },
            dspLoop: (INPUT, OUTPUT) => {
                
        for (IT_FRAME = 0; IT_FRAME < BLOCK_SIZE; IT_FRAME++) {
            G_commons__emitFrame(FRAME)
            N_n_0_17_state.previous = N_n_0_17_outs_0 = N_n_0_17_state.coeff * N_m_n_0_17_0_sig_outs_0 + (1 - N_n_0_17_state.coeff) * N_n_0_17_state.previous
NT_osc_t_setStep(N_n_0_1_state, N_n_0_17_outs_0)

                N_n_0_1_outs_0 = Math.cos(N_n_0_1_state.phase)
                N_n_0_1_state.phase += N_n_0_1_state.step
            
N_n_0_6_state.previous = N_n_0_6_outs_0 = N_n_0_6_state.coeff * N_m_n_0_6_0_sig_outs_0 + (1 - N_n_0_6_state.coeff) * N_n_0_6_state.previous
N_n_0_4_outs_0 = N_n_0_1_outs_0 * (Math.max(Math.min(N_n_0_18_state.maxValue, N_n_0_6_outs_0), N_n_0_18_state.minValue))
OUTPUT[0][IT_FRAME] = N_n_0_4_outs_0
OUTPUT[1][IT_FRAME] = N_n_0_4_outs_0
            FRAME++
        }
    
            },
            io: {
                messageReceivers: {
                    n_0_3: {
                            "0": IO_rcv_n_0_3_0,
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
n_0_12: {
                            "0": IO_rcv_n_0_12_0,
                        },
n_0_13: {
                            "0": IO_rcv_n_0_13_0,
                        },
n_0_14: {
                            "0": IO_rcv_n_0_14_0,
                        },
                },
                messageSenders: {
                    n_0_3: {
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
n_0_12: {
                            "0": () => undefined,
                        },
n_0_13: {
                            "0": () => undefined,
                        },
n_0_14: {
                            "0": () => undefined,
                        },
                },
            }
        }

        
exports.G_commons_getArray = G_commons_getArray
exports.G_commons_setArray = G_commons_setArray
    