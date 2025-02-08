
        
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
G_commons_setArray("scaleFreqs", createFloatArray(8))
G_commons_getArray("scaleFreqs").set([0,0,0,0,0,0,0,0])
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
function G_funcs_mtof(value) {
        return value <= -1500 ? 0: (value > 1499 ? 3.282417553401589e+38 : Math.pow(2, (value - 69) / 12) * 440)
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

function NT_neq_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_neq_setRight(state, value) {
                    state.rightOp = value
                }

function NT_mul_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_mul_setRight(state, value) {
                    state.rightOp = value
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

function NT_add_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_add_setRight(state, value) {
                    state.rightOp = value
                }

function NT_int_setValue(state, value) {
                state.value = G_numbers_roundFloatAsPdInt(value)
            }

const NT_tabread_emptyArray = createFloatArray(1)
function NT_tabread_createState(arrayName) {
            return {
                array: NT_tabread_emptyArray,
                arrayName,
                arrayChangesSubscription: G_sked_ID_NULL,
                readPosition: 0,
                readUntil: 0,
                writePosition: 0,
            }
        }
function NT_tabread_setArrayName(state, arrayName, callback) {
            if (state.arrayChangesSubscription != G_sked_ID_NULL) {
                G_commons_cancelArrayChangesSubscription(state.arrayChangesSubscription)
            }
            state.arrayName = arrayName
            state.array = NT_tabread_emptyArray
            G_commons_subscribeArrayChanges(arrayName, callback)
        }
function NT_tabread_prepareIndex(index, arrayLength) {
            return toInt(Math.min(
                Math.max(
                    0, Math.floor(index)
                ), toFloat(arrayLength - 1)
            ))
        }
function NT_tabread_setArrayNameFinalize(state) {
                state.array = G_commons_getArray(state.arrayName)
            }

function NT_float_setValue(state, value) {
                state.value = value
            }

function NT_spigot_setIsClosed(state, value) {
                state.isClosed = (value === 0)
            }







const NT_tabwrite_emptyArray = createFloatArray(1)
function NT_tabwrite_createState(arrayName) {
            return {
                array: NT_tabwrite_emptyArray,
                arrayName,
                arrayChangesSubscription: G_sked_ID_NULL,
                readPosition: 0,
                readUntil: 0,
                writePosition: 0,
            }
        }
function NT_tabwrite_setArrayName(state, arrayName, callback) {
            if (state.arrayChangesSubscription != G_sked_ID_NULL) {
                G_commons_cancelArrayChangesSubscription(state.arrayChangesSubscription)
            }
            state.arrayName = arrayName
            state.array = NT_tabwrite_emptyArray
            G_commons_subscribeArrayChanges(arrayName, callback)
        }
function NT_tabwrite_prepareIndex(index, arrayLength) {
            return toInt(Math.min(
                Math.max(
                    0, Math.floor(index)
                ), toFloat(arrayLength - 1)
            ))
        }
function NT_tabwrite_setArrayNameFinalize(state) {
                state.array = G_commons_getArray(state.arrayName)
            }
function NT_tabwrite_setWritePosition(state, writePosition) {
                state.writePosition = NT_tabwrite_prepareIndex(writePosition, state.array.length)
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







function NT_lop_t_setFreq(state, freq) {
                state.coeff = Math.max(Math.min(freq * 2 * Math.PI / SAMPLE_RATE, 1), 0)
            }

function NT_osc_t_setStep(state, freq) {
                    state.step = (2 * Math.PI / SAMPLE_RATE) * freq
                }
function NT_osc_t_setPhase(state, phase) {
                    state.phase = phase % 1.0 * 2 * Math.PI
                }







        const N_n_0_2_state = {
                                minValue: 0.01,
maxValue: 0.5,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_hsl_defaultMessageHandler,
messageSender: NT_hsl_defaultMessageHandler,
                            }
const N_n_13_11_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_13_12_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_13_2_state = {
                                msgSpecs: [],
                            }
const N_n_13_0_state = {
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
const N_m_n_13_1_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_9_state = {
                                minValue: -1,
maxValue: 1,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_vsl_defaultMessageHandler,
messageSender: NT_vsl_defaultMessageHandler,
                            }
const N_n_0_11_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_12_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_10_state = {
                                minValue: -1,
maxValue: 1,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_vsl_defaultMessageHandler,
messageSender: NT_vsl_defaultMessageHandler,
                            }
const N_n_0_13_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_14_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_32_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_12_0_state = {
                                value: 0,
                            }
const N_n_12_11_state = {
                                array: NT_tabread_emptyArray,
arrayName: "scaleFreqs",
arrayChangesSubscription: G_sked_ID_NULL,
readPosition: 0,
readUntil: 0,
writePosition: 0,
                            }
const N_m_n_12_1_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_2_17_state = {
                                value: 0,
                            }
const N_n_7_0_state = {
                                isClosed: true,
                            }
const N_n_3_12_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_2_16_state = {
                                array: NT_tabwrite_emptyArray,
arrayName: "scaleFreqs",
arrayChangesSubscription: G_sked_ID_NULL,
readPosition: 0,
readUntil: 0,
writePosition: 0,
                            }
const N_n_2_13_state = {
                                msgSpecs: [],
                            }
const N_n_2_12_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_2_19_state = {
                                value: 0,
                            }
const N_n_3_11_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_3_10_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_3_7_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_3_6_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_3_2_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_3_0_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_3_19_state = {
                                value: 0,
                            }
const N_n_7_1_state = {
                                isClosed: true,
                            }
const N_n_4_9_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_4_14_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_4_13_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_4_6_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_4_5_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_4_12_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_4_0_state = {
                                floatInputs: new Map(),
stringInputs: new Map(),
outputs: new Array(1),
                            }
const N_n_4_19_state = {
                                value: 0,
                            }
const N_n_7_2_state = {
                                isClosed: true,
                            }
const N_n_5_9_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_5_8_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_5_7_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_5_6_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_5_5_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_7_3_state = {
                                isClosed: true,
                            }
const N_n_6_4_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_6_16_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_6_3_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_6_15_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_6_12_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_12_6_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_12_16_state = {
                                msgSpecs: [],
                            }
const N_n_12_10_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_14_1_state = {
                                msgSpecs: [],
                            }
const N_n_0_8_state = {
                                msgSpecs: [],
                            }
const N_n_0_27_state = {
                                msgSpecs: [],
                            }
const N_n_2_14_state = {
                                msgSpecs: [],
                            }
const N_n_1_4_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_1_9_state = {
                                msgSpecs: [],
                            }
const N_n_7_4_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_8_1_state = {
                                msgSpecs: [],
                            }
const N_n_8_4_state = {
                                msgSpecs: [],
                            }
const N_n_9_1_state = {
                                msgSpecs: [],
                            }
const N_n_9_4_state = {
                                msgSpecs: [],
                            }
const N_n_10_1_state = {
                                msgSpecs: [],
                            }
const N_n_10_4_state = {
                                msgSpecs: [],
                            }
const N_n_11_1_state = {
                                msgSpecs: [],
                            }
const N_n_11_4_state = {
                                msgSpecs: [],
                            }
const N_n_1_7_state = {
                                msgSpecs: [],
                            }
const N_n_1_10_state = {
                                msgSpecs: [],
                            }
const N_n_1_11_state = {
                                msgSpecs: [],
                            }
const N_n_1_8_state = {
                                msgSpecs: [],
                            }
const N_n_1_12_state = {
                                msgSpecs: [],
                            }
const N_n_0_15_state = {
                                msgSpecs: [],
                            }
const N_n_2_2_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_2_0_state = {
                                msgSpecs: [],
                            }
const N_n_2_1_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_2_4_state = {
                                msgSpecs: [],
                            }
const N_n_0_16_state = {
                                msgSpecs: [],
                            }
const N_n_0_17_state = {
                                msgSpecs: [],
                            }
const N_n_0_18_state = {
                                msgSpecs: [],
                            }
const N_n_0_19_state = {
                                msgSpecs: [],
                            }
const N_n_0_20_state = {
                                msgSpecs: [],
                            }
const N_n_0_21_state = {
                                msgSpecs: [],
                            }
const N_n_0_22_state = {
                                msgSpecs: [],
                            }
const N_n_0_23_state = {
                                msgSpecs: [],
                            }
const N_n_0_24_state = {
                                msgSpecs: [],
                            }
const N_n_0_25_state = {
                                msgSpecs: [],
                            }
const N_n_0_26_state = {
                                msgSpecs: [],
                            }
const N_n_0_28_state = {
                                msgSpecs: [],
                            }
const N_n_0_29_state = {
                                msgSpecs: [],
                            }
const N_n_0_30_state = {
                                msgSpecs: [],
                            }
const N_m_n_12_1_1_sig_state = {
                                currentValue: 5,
                            }
const N_n_12_1_state = {
                                previous: 0,
coeff: 0,
                            }
const N_n_12_15_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_13_1_1_sig_state = {
                                currentValue: 1,
                            }
const N_n_13_1_state = {
                                previous: 0,
coeff: 0,
                            }
const N_m_n_13_9_1_sig_state = {
                                currentValue: 0.8,
                            }
const N_m_n_13_10_0_sig_state = {
                                currentValue: 0.5,
                            }
const N_n_13_10_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_13_6_1_sig_state = {
                                currentValue: 0.05,
                            }
const N_m_n_13_8_1_sig_state = {
                                currentValue: 0.2,
                            }
        
function N_n_0_2_rcvs_0(m) {
                            
                NT_hsl_receiveMessage(N_n_0_2_state, m)
                return
            
                            throw new Error('Node "n_0_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_13_11_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_neq_setLeft(N_n_13_11_state, G_msg_readFloatToken(m, 0))
                        N_n_13_12_rcvs_1(G_msg_floats([N_n_13_11_state.leftOp != N_n_13_11_state.rightOp ? 1: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_13_12_rcvs_1(G_msg_floats([N_n_13_11_state.leftOp != N_n_13_11_state.rightOp ? 1: 0]))
                        return
                    }
                
                            throw new Error('Node "n_13_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_13_12_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_13_12_state, G_msg_readFloatToken(m, 0))
                        N_n_13_2_rcvs_0(G_msg_floats([N_n_13_12_state.leftOp * N_n_13_12_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_13_2_rcvs_0(G_msg_floats([N_n_13_12_state.leftOp * N_n_13_12_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_13_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_13_12_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_mul_setRight(N_n_13_12_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_13_12", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_13_2_rcvs_0(m) {
                            
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

                    N_n_13_2_state.msgSpecs.splice(0, N_n_13_2_state.msgSpecs.length - 1)
                    N_n_13_2_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_13_2_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_13_2_state.msgSpecs.length; i++) {
                        if (N_n_13_2_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_13_2_state.msgSpecs[i].send, N_n_13_2_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_13_0_rcvs_0(N_n_13_2_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_13_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_13_0_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                NT_line_stopCurrentLine(N_n_13_0_state)
                switch (G_msg_getLength(m)) {
                    case 3:
                        NT_line_setGrain(N_n_13_0_state, G_msg_readFloatToken(m, 2))
                    case 2:
                        NT_line_setNextDuration(N_n_13_0_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        const targetValue = G_msg_readFloatToken(m, 0)
                        if (N_n_13_0_state.nextDurationSamp === 0) {
                            N_n_13_0_state.currentValue = targetValue
                            N_m_n_13_1_0__routemsg_rcvs_0(G_msg_floats([targetValue]))
                        } else {
                            N_m_n_13_1_0__routemsg_rcvs_0(G_msg_floats([N_n_13_0_state.currentValue]))
                            NT_line_setNewLine(N_n_13_0_state, targetValue)
                            NT_line_incrementTime(N_n_13_0_state, N_n_13_0_state.currentLine.dx)
                            NT_line_scheduleNextTick(N_n_13_0_state)
                        }
                        
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_stopCurrentLine(N_n_13_0_state)
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_line_stopCurrentLine(N_n_13_0_state)
                N_n_13_0_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_13_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_13_1_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_13_1_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_13_1_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_13_1_0_sig_outs_0 = 0
function N_m_n_13_1_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_13_1_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_13_1_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_2_0_rcvs_0(m) {
                            
                IO_snd_n_0_2_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_2_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_9_rcvs_0(m) {
                            
                NT_vsl_receiveMessage(N_n_0_9_state, m)
                return
            
                            throw new Error('Node "n_0_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_11_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_11_state, G_msg_readFloatToken(m, 0))
                        N_n_0_12_rcvs_0(G_msg_floats([N_n_0_11_state.leftOp + N_n_0_11_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_12_rcvs_0(G_msg_floats([N_n_0_11_state.leftOp + N_n_0_11_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_12_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_12_state, G_msg_readFloatToken(m, 0))
                        N_n_0_2_rcvs_0(G_msg_floats([N_n_0_12_state.leftOp * N_n_0_12_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_2_rcvs_0(G_msg_floats([N_n_0_12_state.leftOp * N_n_0_12_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_9_0_rcvs_0(m) {
                            
                IO_snd_n_0_9_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_9_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_10_rcvs_0(m) {
                            
                NT_vsl_receiveMessage(N_n_0_10_state, m)
                return
            
                            throw new Error('Node "n_0_10", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_13_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_13_state, G_msg_readFloatToken(m, 0))
                        N_n_0_14_rcvs_0(G_msg_floats([N_n_0_13_state.leftOp + N_n_0_13_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_14_rcvs_0(G_msg_floats([N_n_0_13_state.leftOp + N_n_0_13_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_14_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_14_state, G_msg_readFloatToken(m, 0))
                        N_n_0_32_rcvs_0(G_msg_floats([N_n_0_14_state.leftOp * N_n_0_14_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_32_rcvs_0(G_msg_floats([N_n_0_14_state.leftOp * N_n_0_14_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_14", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_32_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_32_state, G_msg_readFloatToken(m, 0))
                        N_n_12_0_rcvs_0(G_msg_floats([N_n_0_32_state.leftOp * N_n_0_32_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_12_0_rcvs_0(G_msg_floats([N_n_0_32_state.leftOp * N_n_0_32_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_32", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_32_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_mul_setRight(N_n_0_32_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_32", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_12_0_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_12_0_state, G_msg_readFloatToken(m, 0))
                N_n_12_11_rcvs_0(G_msg_floats([N_n_12_0_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_12_11_rcvs_0(G_msg_floats([N_n_12_0_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_12_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_12_11_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {        
                if (N_n_12_11_state.array.length === 0) {
                    N_m_n_12_1_0__routemsg_rcvs_0(G_msg_floats([0]))

                } else {
                    N_m_n_12_1_0__routemsg_rcvs_0(G_msg_floats([N_n_12_11_state.array[
                        NT_tabread_prepareIndex(
                            G_msg_readFloatToken(m, 0), 
                            N_n_12_11_state.array.length
                        )
                    ]]))
                }
                return 

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_tabread_setArrayName(
                    N_n_12_11_state, 
                    G_msg_readStringToken(m, 1),
                    () => NT_tabread_setArrayNameFinalize(N_n_12_11_state)
                )
                return
        
            }
        
                            throw new Error('Node "n_12_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_12_1_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_12_1_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_12_1_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_12_1_0_sig_outs_0 = 0
function N_m_n_12_1_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_12_1_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_12_1_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_10_0_rcvs_0(m) {
                            
                IO_snd_n_0_10_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_10_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_17_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_2_17_state, G_msg_readFloatToken(m, 0))
                N_n_2_17_snds_0(G_msg_floats([N_n_2_17_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_2_17_snds_0(G_msg_floats([N_n_2_17_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_2_17", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_7_0_rcvs_0(m) {
                            
            if (!N_n_7_0_state.isClosed) {
                N_n_3_15_rcvs_0(m)
            }
            return
        
                            throw new Error('Node "n_7_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_7_0_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_spigot_setIsClosed(N_n_7_0_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_7_0", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_15_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_3_18_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_3_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_18_rcvs_0(m) {
                            
            N_n_3_19_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_3_0_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_3_2_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_3_6_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_3_7_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_3_10_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_3_11_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_3_12_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_3_18", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_12_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_3_12_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_3_12_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_3_12_state.outputs[0] = +(N_n_3_12_state.floatInputs.get(0) * 2)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_3_12_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_3_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_11_rcvs_0(m) {
                            
            N_n_2_13_rcvs_0(G_bangUtils_bang())
N_n_2_16_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_2_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_16_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {        
                if (N_n_2_16_state.array.length === 0) {
                    return

                } else {
                    N_n_2_16_state.array[N_n_2_16_state.writePosition] = G_msg_readFloatToken(m, 0)
                    return
                }

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_tabwrite_setArrayName(
                    N_n_2_16_state, 
                    G_msg_readStringToken(m, 1),
                    () => NT_tabwrite_setArrayNameFinalize(N_n_2_16_state),
                )
                return
        
            }
        
                            throw new Error('Node "n_2_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_2_16_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_tabwrite_setWritePosition(N_n_2_16_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_2_16", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_13_rcvs_0(m) {
                            
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

                    N_n_2_13_state.msgSpecs.splice(0, N_n_2_13_state.msgSpecs.length - 1)
                    N_n_2_13_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_13_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_13_state.msgSpecs.length; i++) {
                        if (N_n_2_13_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_13_state.msgSpecs[i].send, N_n_2_13_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_12_rcvs_0(N_n_2_13_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_12_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_2_12_state, G_msg_readFloatToken(m, 0))
                        N_n_2_19_rcvs_0(G_msg_floats([N_n_2_12_state.leftOp + N_n_2_12_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_19_rcvs_0(G_msg_floats([N_n_2_12_state.leftOp + N_n_2_12_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_2_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_2_12_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_2_12_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_2_12", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_19_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_2_19_state, G_msg_readFloatToken(m, 0))
                N_n_2_19_snds_0(G_msg_floats([N_n_2_19_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_2_19_snds_0(G_msg_floats([N_n_2_19_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_2_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_11_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_3_11_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_3_11_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_3_11_state.outputs[0] = +(N_n_3_11_state.floatInputs.get(0) * 15 / 8)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_3_11_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_3_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_10_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_3_10_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_3_10_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_3_10_state.outputs[0] = +(N_n_3_10_state.floatInputs.get(0) * 5 / 3)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_3_10_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_3_10", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_7_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_3_7_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_3_7_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_3_7_state.outputs[0] = +(N_n_3_7_state.floatInputs.get(0) * 3 / 2)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_3_7_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_3_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_6_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_3_6_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_3_6_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_3_6_state.outputs[0] = +(N_n_3_6_state.floatInputs.get(0) * 4 / 3)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_3_6_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_3_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_2_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_3_2_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_3_2_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_3_2_state.outputs[0] = +(N_n_3_2_state.floatInputs.get(0) * 5 / 4)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_3_2_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_3_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_0_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_3_0_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_3_0_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_3_0_state.outputs[0] = +(N_n_3_0_state.floatInputs.get(0) * 9 / 8)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_3_0_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_3_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_19_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_3_19_state, G_msg_readFloatToken(m, 0))
                N_n_2_11_rcvs_0(G_msg_floats([N_n_3_19_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_2_11_rcvs_0(G_msg_floats([N_n_3_19_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_3_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_7_1_rcvs_0(m) {
                            
            if (!N_n_7_1_state.isClosed) {
                N_n_4_15_rcvs_0(m)
            }
            return
        
                            throw new Error('Node "n_7_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_7_1_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_spigot_setIsClosed(N_n_7_1_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_7_1", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_15_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_4_17_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_4_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_17_rcvs_0(m) {
                            
            N_n_4_19_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_4_0_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_4_12_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_4_5_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_4_6_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_4_13_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_4_14_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_4_9_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_4_17", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_9_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_4_9_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_4_9_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_4_9_state.outputs[0] = +(N_n_4_9_state.floatInputs.get(0) * 2)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_4_9_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_4_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_14_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_4_14_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_4_14_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_4_14_state.outputs[0] = +(N_n_4_14_state.floatInputs.get(0) * 9 / 5)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_4_14_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_4_14", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_13_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_4_13_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_4_13_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_4_13_state.outputs[0] = +(N_n_4_13_state.floatInputs.get(0) * 8 / 5)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_4_13_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_4_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_6_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_4_6_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_4_6_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_4_6_state.outputs[0] = +(N_n_4_6_state.floatInputs.get(0) * 3 / 2)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_4_6_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_4_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_5_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_4_5_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_4_5_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_4_5_state.outputs[0] = +(N_n_4_5_state.floatInputs.get(0) * 4 / 3)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_4_5_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_4_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_12_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_4_12_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_4_12_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_4_12_state.outputs[0] = +(N_n_4_12_state.floatInputs.get(0) * 6 / 5)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_4_12_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_4_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_0_rcvs_0(m) {
                            
                if (!G_bangUtils_isBang(m)) {
                    for (let i = 0; i < G_msg_getLength(m); i++) {
                        N_n_4_0_state.stringInputs.set(i, G_tokenConversion_toString_(m, i))
                        N_n_4_0_state.floatInputs.set(i, G_tokenConversion_toFloat(m, i))
                    }
                }
    
                
                    N_n_4_0_state.outputs[0] = +(N_n_4_0_state.floatInputs.get(0) * 9 / 8)
            
                    N_n_2_11_rcvs_0(G_msg_floats([N_n_4_0_state.outputs[0]]))
                
                
                return
            
                            throw new Error('Node "n_4_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_19_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_4_19_state, G_msg_readFloatToken(m, 0))
                N_n_2_11_rcvs_0(G_msg_floats([N_n_4_19_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_2_11_rcvs_0(G_msg_floats([N_n_4_19_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_4_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_7_2_rcvs_0(m) {
                            
            if (!N_n_7_2_state.isClosed) {
                N_n_5_17_rcvs_0(m)
            }
            return
        
                            throw new Error('Node "n_7_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_7_2_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_spigot_setIsClosed(N_n_7_2_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_7_2", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_17_rcvs_0(m) {
                            
            N_n_5_10_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_5_5_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_5_6_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_5_7_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_5_8_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_5_9_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_5_17", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_9_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_5_9_state, G_msg_readFloatToken(m, 0))
                        N_n_5_15_rcvs_0(G_msg_floats([N_n_5_9_state.leftOp + N_n_5_9_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_5_15_rcvs_0(G_msg_floats([N_n_5_9_state.leftOp + N_n_5_9_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_5_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_15_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_5_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_8_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_5_8_state, G_msg_readFloatToken(m, 0))
                        N_n_5_14_rcvs_0(G_msg_floats([N_n_5_8_state.leftOp + N_n_5_8_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_5_14_rcvs_0(G_msg_floats([N_n_5_8_state.leftOp + N_n_5_8_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_5_8", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_14_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_5_14", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_7_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_5_7_state, G_msg_readFloatToken(m, 0))
                        N_n_5_13_rcvs_0(G_msg_floats([N_n_5_7_state.leftOp + N_n_5_7_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_5_13_rcvs_0(G_msg_floats([N_n_5_7_state.leftOp + N_n_5_7_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_5_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_13_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_5_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_6_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_5_6_state, G_msg_readFloatToken(m, 0))
                        N_n_5_12_rcvs_0(G_msg_floats([N_n_5_6_state.leftOp + N_n_5_6_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_5_12_rcvs_0(G_msg_floats([N_n_5_6_state.leftOp + N_n_5_6_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_5_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_12_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_5_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_5_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_5_5_state, G_msg_readFloatToken(m, 0))
                        N_n_5_11_rcvs_0(G_msg_floats([N_n_5_5_state.leftOp + N_n_5_5_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_5_11_rcvs_0(G_msg_floats([N_n_5_5_state.leftOp + N_n_5_5_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_5_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_11_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_5_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_5_10_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_5_10", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_7_3_rcvs_0(m) {
                            
            if (!N_n_7_3_state.isClosed) {
                N_n_6_18_rcvs_0(m)
            }
            return
        
                            throw new Error('Node "n_7_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_7_3_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_spigot_setIsClosed(N_n_7_3_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_7_3", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_18_rcvs_0(m) {
                            
            N_n_6_5_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_6_12_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_6_15_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_6_3_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_6_16_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_6_4_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_6_18", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_4_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_6_4_state, G_msg_readFloatToken(m, 0))
                        N_n_6_10_rcvs_0(G_msg_floats([N_n_6_4_state.leftOp + N_n_6_4_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_6_10_rcvs_0(G_msg_floats([N_n_6_4_state.leftOp + N_n_6_4_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_6_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_10_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_6_10", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_16_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_6_16_state, G_msg_readFloatToken(m, 0))
                        N_n_6_9_rcvs_0(G_msg_floats([N_n_6_16_state.leftOp + N_n_6_16_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_6_9_rcvs_0(G_msg_floats([N_n_6_16_state.leftOp + N_n_6_16_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_6_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_9_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_6_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_3_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_6_3_state, G_msg_readFloatToken(m, 0))
                        N_n_6_8_rcvs_0(G_msg_floats([N_n_6_3_state.leftOp + N_n_6_3_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_6_8_rcvs_0(G_msg_floats([N_n_6_3_state.leftOp + N_n_6_3_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_6_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_8_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_6_8", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_15_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_6_15_state, G_msg_readFloatToken(m, 0))
                        N_n_6_7_rcvs_0(G_msg_floats([N_n_6_15_state.leftOp + N_n_6_15_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_6_7_rcvs_0(G_msg_floats([N_n_6_15_state.leftOp + N_n_6_15_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_6_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_7_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_6_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_12_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_6_12_state, G_msg_readFloatToken(m, 0))
                        N_n_6_6_rcvs_0(G_msg_floats([N_n_6_12_state.leftOp + N_n_6_12_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_6_6_rcvs_0(G_msg_floats([N_n_6_12_state.leftOp + N_n_6_12_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_6_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_6_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_6_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_5_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_11_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_6_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_12_6_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_12_6_state, 
                            () => N_n_12_16_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_12_6_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_12_6_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_12_6_state,
                        () => N_n_12_16_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_12_6_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_12_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_12_16_rcvs_0(m) {
                            
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

                    N_n_12_16_state.msgSpecs.splice(0, N_n_12_16_state.msgSpecs.length - 1)
                    N_n_12_16_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_12_16_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_12_16_state.msgSpecs.length; i++) {
                        if (N_n_12_16_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_12_16_state.msgSpecs[i].send, N_n_12_16_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_12_0_rcvs_0(N_n_12_16_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_12_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_12_10_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_12_10_state, G_msg_readFloatToken(m, 0))
                        G_msg_VOID_MESSAGE_RECEIVER(G_msg_floats([N_n_12_10_state.leftOp * N_n_12_10_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        G_msg_VOID_MESSAGE_RECEIVER(G_msg_floats([N_n_12_10_state.leftOp * N_n_12_10_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_12_10", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_12_10_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_mul_setRight(N_n_12_10_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_12_10", inlet "1", unsupported message : ' + G_msg_display(m))
                        }







function N_n_14_2_rcvs_0(m) {
                            
            N_n_0_8_rcvs_0(G_bangUtils_bang())
N_n_14_1_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_14_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_14_1_rcvs_0(m) {
                            
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

                    N_n_14_1_state.msgSpecs.splice(0, N_n_14_1_state.msgSpecs.length - 1)
                    N_n_14_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_14_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_14_1_state.msgSpecs.length; i++) {
                        if (N_n_14_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_14_1_state.msgSpecs[i].send, N_n_14_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            G_msg_VOID_MESSAGE_RECEIVER(N_n_14_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_14_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_8_rcvs_0(m) {
                            
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

                    N_n_0_8_state.msgSpecs.splice(0, N_n_0_8_state.msgSpecs.length - 1)
                    N_n_0_8_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_8_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_8_state.msgSpecs.length; i++) {
                        if (N_n_0_8_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_8_state.msgSpecs[i].send, N_n_0_8_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_8_snds_0(N_n_0_8_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_8", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_31_rcvs_0(m) {
                            
            N_n_0_15_rcvs_0(G_bangUtils_bang())
N_n_0_27_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_0_31", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_27_rcvs_0(m) {
                            
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

                    N_n_0_27_state.msgSpecs.splice(0, N_n_0_27_state.msgSpecs.length - 1)
                    N_n_0_27_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_27_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_27_state.msgSpecs.length; i++) {
                        if (N_n_0_27_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_27_state.msgSpecs[i].send, N_n_0_27_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_27_snds_0(N_n_0_27_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_27", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_6_rcvs_0(m) {
                            
            N_n_1_4_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_1_6_snds_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_1_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_14_rcvs_0(m) {
                            
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

                    N_n_2_14_state.msgSpecs.splice(0, N_n_2_14_state.msgSpecs.length - 1)
                    N_n_2_14_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_14_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_14_state.msgSpecs.length; i++) {
                        if (N_n_2_14_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_14_state.msgSpecs[i].send, N_n_2_14_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_12_rcvs_1(N_n_2_14_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_14", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_4_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_1_0_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_1_1_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_1_2_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_1_3_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_1_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_0_rcvs_0(m) {
                            
            N_n_1_7_rcvs_0(G_bangUtils_bang())
N_n_1_9_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_1_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_9_rcvs_0(m) {
                            
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

                    N_n_1_9_state.msgSpecs.splice(0, N_n_1_9_state.msgSpecs.length - 1)
                    N_n_1_9_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_1_9_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_1_9_state.msgSpecs.length; i++) {
                        if (N_n_1_9_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_1_9_state.msgSpecs[i].send, N_n_1_9_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_7_4_rcvs_0(N_n_1_9_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_1_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_7_4_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_7_4_snds_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_7_4_snds_1(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_7_4_snds_2(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_7_4_snds_3(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_7_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_8_1_rcvs_0(m) {
                            
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

                    N_n_8_1_state.msgSpecs.splice(0, N_n_8_1_state.msgSpecs.length - 1)
                    N_n_8_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_8_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_8_1_state.msgSpecs.length; i++) {
                        if (N_n_8_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_8_1_state.msgSpecs[i].send, N_n_8_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_7_0_rcvs_1(N_n_8_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_8_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_8_4_rcvs_0(m) {
                            
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

                    N_n_8_4_state.msgSpecs.splice(0, N_n_8_4_state.msgSpecs.length - 1)
                    N_n_8_4_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_8_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_8_4_state.msgSpecs.length; i++) {
                        if (N_n_8_4_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_8_4_state.msgSpecs[i].send, N_n_8_4_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_8_4_snds_0(N_n_8_4_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_8_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_9_1_rcvs_0(m) {
                            
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

                    N_n_9_1_state.msgSpecs.splice(0, N_n_9_1_state.msgSpecs.length - 1)
                    N_n_9_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_9_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_9_1_state.msgSpecs.length; i++) {
                        if (N_n_9_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_9_1_state.msgSpecs[i].send, N_n_9_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_7_1_rcvs_1(N_n_9_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_9_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_9_4_rcvs_0(m) {
                            
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

                    N_n_9_4_state.msgSpecs.splice(0, N_n_9_4_state.msgSpecs.length - 1)
                    N_n_9_4_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_9_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_9_4_state.msgSpecs.length; i++) {
                        if (N_n_9_4_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_9_4_state.msgSpecs[i].send, N_n_9_4_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_9_4_snds_0(N_n_9_4_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_9_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_10_1_rcvs_0(m) {
                            
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

                    N_n_10_1_state.msgSpecs.splice(0, N_n_10_1_state.msgSpecs.length - 1)
                    N_n_10_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_10_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_10_1_state.msgSpecs.length; i++) {
                        if (N_n_10_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_10_1_state.msgSpecs[i].send, N_n_10_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_7_2_rcvs_1(N_n_10_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_10_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_10_4_rcvs_0(m) {
                            
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

                    N_n_10_4_state.msgSpecs.splice(0, N_n_10_4_state.msgSpecs.length - 1)
                    N_n_10_4_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_10_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_10_4_state.msgSpecs.length; i++) {
                        if (N_n_10_4_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_10_4_state.msgSpecs[i].send, N_n_10_4_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_10_4_snds_0(N_n_10_4_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_10_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_11_1_rcvs_0(m) {
                            
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

                    N_n_11_1_state.msgSpecs.splice(0, N_n_11_1_state.msgSpecs.length - 1)
                    N_n_11_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_11_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_11_1_state.msgSpecs.length; i++) {
                        if (N_n_11_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_11_1_state.msgSpecs[i].send, N_n_11_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_7_3_rcvs_1(N_n_11_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_11_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_11_4_rcvs_0(m) {
                            
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

                    N_n_11_4_state.msgSpecs.splice(0, N_n_11_4_state.msgSpecs.length - 1)
                    N_n_11_4_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_11_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_11_4_state.msgSpecs.length; i++) {
                        if (N_n_11_4_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_11_4_state.msgSpecs[i].send, N_n_11_4_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_11_4_snds_0(N_n_11_4_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_11_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_7_rcvs_0(m) {
                            
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

                    N_n_1_7_state.msgSpecs.splice(0, N_n_1_7_state.msgSpecs.length - 1)
                    N_n_1_7_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_1_7_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_1_7_state.msgSpecs.length; i++) {
                        if (N_n_1_7_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_1_7_state.msgSpecs[i].send, N_n_1_7_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_32_rcvs_1(N_n_1_7_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_1_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_1_rcvs_0(m) {
                            
            N_n_1_7_rcvs_0(G_bangUtils_bang())
N_n_1_10_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_1_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_10_rcvs_0(m) {
                            
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

                    N_n_1_10_state.msgSpecs.splice(0, N_n_1_10_state.msgSpecs.length - 1)
                    N_n_1_10_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_1_10_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_1_10_state.msgSpecs.length; i++) {
                        if (N_n_1_10_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_1_10_state.msgSpecs[i].send, N_n_1_10_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_7_4_rcvs_0(N_n_1_10_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_1_10", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_2_rcvs_0(m) {
                            
            N_n_1_8_rcvs_0(G_bangUtils_bang())
N_n_1_11_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_1_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_11_rcvs_0(m) {
                            
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

                    N_n_1_11_state.msgSpecs.splice(0, N_n_1_11_state.msgSpecs.length - 1)
                    N_n_1_11_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_1_11_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_1_11_state.msgSpecs.length; i++) {
                        if (N_n_1_11_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_1_11_state.msgSpecs[i].send, N_n_1_11_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_7_4_rcvs_0(N_n_1_11_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_1_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_8_rcvs_0(m) {
                            
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

                    N_n_1_8_state.msgSpecs.splice(0, N_n_1_8_state.msgSpecs.length - 1)
                    N_n_1_8_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_1_8_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_1_8_state.msgSpecs.length; i++) {
                        if (N_n_1_8_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_1_8_state.msgSpecs[i].send, N_n_1_8_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_32_rcvs_1(N_n_1_8_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_1_8", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_3_rcvs_0(m) {
                            
            N_n_1_8_rcvs_0(G_bangUtils_bang())
N_n_1_12_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_1_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_12_rcvs_0(m) {
                            
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

                    N_n_1_12_state.msgSpecs.splice(0, N_n_1_12_state.msgSpecs.length - 1)
                    N_n_1_12_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_1_12_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_1_12_state.msgSpecs.length; i++) {
                        if (N_n_1_12_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_1_12_state.msgSpecs[i].send, N_n_1_12_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_7_4_rcvs_0(N_n_1_12_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_1_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_27_0_rcvs_0(m) {
                            
                IO_snd_n_0_27_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_27_0", inlet "0", unsupported message : ' + G_msg_display(m))
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

function N_n_2_15_rcvs_0(m) {
                            
            N_n_2_14_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_2_2_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_2_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_2_rcvs_0(m) {
                            
                    if (N_n_2_2_state.filterType === G_msg_STRING_TOKEN) {
                        if (
                            (N_n_2_2_state.stringFilter === 'float'
                                && G_msg_isFloatToken(m, 0))
                            || (N_n_2_2_state.stringFilter === 'symbol'
                                && G_msg_isStringToken(m, 0))
                            || (N_n_2_2_state.stringFilter === 'list'
                                && G_msg_getLength(m) > 1)
                            || (N_n_2_2_state.stringFilter === 'bang' 
                                && G_bangUtils_isBang(m))
                        ) {
                            N_n_2_5_rcvs_0(m)
                            return
                        
                        } else if (
                            G_msg_isStringToken(m, 0)
                            && G_msg_readStringToken(m, 0) === N_n_2_2_state.stringFilter
                        ) {
                            N_n_2_5_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                            return
                        }
    
                    } else if (
                        G_msg_isFloatToken(m, 0)
                        && G_msg_readFloatToken(m, 0) === N_n_2_2_state.floatFilter
                    ) {
                        N_n_2_5_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                        return
                    }
                
                    N_n_2_3_rcvs_0(m)
                return
                
                            throw new Error('Node "n_2_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_5_rcvs_0(m) {
                            
            N_n_2_4_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_2_0_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_2_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_0_rcvs_0(m) {
                            
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

                    N_n_2_0_state.msgSpecs.splice(0, N_n_2_0_state.msgSpecs.length - 1)
                    N_n_2_0_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_0_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_0_state.msgSpecs.length; i++) {
                        if (N_n_2_0_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_0_state.msgSpecs[i].send, N_n_2_0_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_1_rcvs_0(N_n_2_0_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_1_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_2_1_state, G_msg_readFloatToken(m, 0))
                        N_n_2_17_rcvs_0(G_msg_floats([N_n_2_1_state.leftOp + N_n_2_1_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_17_rcvs_0(G_msg_floats([N_n_2_1_state.leftOp + N_n_2_1_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_2_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_2_1_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_2_1_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_2_1", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_4_rcvs_0(m) {
                            
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

                    N_n_2_4_state.msgSpecs.splice(0, N_n_2_4_state.msgSpecs.length - 1)
                    N_n_2_4_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_4_state.msgSpecs.length; i++) {
                        if (N_n_2_4_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_4_state.msgSpecs[i].send, N_n_2_4_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_1_rcvs_1(N_n_2_4_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_3_rcvs_0(m) {
                            
            N_n_2_1_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_2_0_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_2_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_15_0_rcvs_0(m) {
                            
                IO_snd_n_0_15_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_15_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_8_0_rcvs_0(m) {
                            
                IO_snd_n_0_8_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_8_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }













function N_n_0_16_rcvs_0(m) {
                            
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

                    N_n_0_16_state.msgSpecs.splice(0, N_n_0_16_state.msgSpecs.length - 1)
                    N_n_0_16_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_16_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_16_state.msgSpecs.length; i++) {
                        if (N_n_0_16_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_16_state.msgSpecs[i].send, N_n_0_16_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_16_snds_0(N_n_0_16_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_16_0_rcvs_0(m) {
                            
                IO_snd_n_0_16_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_16_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_17_rcvs_0(m) {
                            
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

                    N_n_0_17_state.msgSpecs.splice(0, N_n_0_17_state.msgSpecs.length - 1)
                    N_n_0_17_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_17_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_17_state.msgSpecs.length; i++) {
                        if (N_n_0_17_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_17_state.msgSpecs[i].send, N_n_0_17_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_17_snds_0(N_n_0_17_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_17", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_17_0_rcvs_0(m) {
                            
                IO_snd_n_0_17_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_17_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_18_rcvs_0(m) {
                            
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

                    N_n_0_18_state.msgSpecs.splice(0, N_n_0_18_state.msgSpecs.length - 1)
                    N_n_0_18_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_18_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_18_state.msgSpecs.length; i++) {
                        if (N_n_0_18_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_18_state.msgSpecs[i].send, N_n_0_18_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_18_snds_0(N_n_0_18_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_18", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_18_0_rcvs_0(m) {
                            
                IO_snd_n_0_18_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_18_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_19_rcvs_0(m) {
                            
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

                    N_n_0_19_state.msgSpecs.splice(0, N_n_0_19_state.msgSpecs.length - 1)
                    N_n_0_19_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_19_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_19_state.msgSpecs.length; i++) {
                        if (N_n_0_19_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_19_state.msgSpecs[i].send, N_n_0_19_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_19_snds_0(N_n_0_19_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_19_0_rcvs_0(m) {
                            
                IO_snd_n_0_19_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_19_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_20_rcvs_0(m) {
                            
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

                    N_n_0_20_state.msgSpecs.splice(0, N_n_0_20_state.msgSpecs.length - 1)
                    N_n_0_20_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_20_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_20_state.msgSpecs.length; i++) {
                        if (N_n_0_20_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_20_state.msgSpecs[i].send, N_n_0_20_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_20_snds_0(N_n_0_20_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_20", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_20_0_rcvs_0(m) {
                            
                IO_snd_n_0_20_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_20_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_21_rcvs_0(m) {
                            
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

                    N_n_0_21_state.msgSpecs.splice(0, N_n_0_21_state.msgSpecs.length - 1)
                    N_n_0_21_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_21_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_21_state.msgSpecs.length; i++) {
                        if (N_n_0_21_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_21_state.msgSpecs[i].send, N_n_0_21_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_21_snds_0(N_n_0_21_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_21", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_21_0_rcvs_0(m) {
                            
                IO_snd_n_0_21_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_21_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_22_rcvs_0(m) {
                            
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

                    N_n_0_22_state.msgSpecs.splice(0, N_n_0_22_state.msgSpecs.length - 1)
                    N_n_0_22_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_22_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_22_state.msgSpecs.length; i++) {
                        if (N_n_0_22_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_22_state.msgSpecs[i].send, N_n_0_22_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_22_snds_0(N_n_0_22_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_22", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_22_0_rcvs_0(m) {
                            
                IO_snd_n_0_22_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_22_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_23_rcvs_0(m) {
                            
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

                    N_n_0_23_state.msgSpecs.splice(0, N_n_0_23_state.msgSpecs.length - 1)
                    N_n_0_23_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_23_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_23_state.msgSpecs.length; i++) {
                        if (N_n_0_23_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_23_state.msgSpecs[i].send, N_n_0_23_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_23_snds_0(N_n_0_23_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_23", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_23_0_rcvs_0(m) {
                            
                IO_snd_n_0_23_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_23_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_24_rcvs_0(m) {
                            
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

                    N_n_0_24_state.msgSpecs.splice(0, N_n_0_24_state.msgSpecs.length - 1)
                    N_n_0_24_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_24_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_24_state.msgSpecs.length; i++) {
                        if (N_n_0_24_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_24_state.msgSpecs[i].send, N_n_0_24_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_24_snds_0(N_n_0_24_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_24", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_24_0_rcvs_0(m) {
                            
                IO_snd_n_0_24_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_24_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_25_rcvs_0(m) {
                            
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

                    N_n_0_25_state.msgSpecs.splice(0, N_n_0_25_state.msgSpecs.length - 1)
                    N_n_0_25_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_25_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_25_state.msgSpecs.length; i++) {
                        if (N_n_0_25_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_25_state.msgSpecs[i].send, N_n_0_25_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_25_snds_0(N_n_0_25_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_25", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_25_0_rcvs_0(m) {
                            
                IO_snd_n_0_25_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_25_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_26_rcvs_0(m) {
                            
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

                    N_n_0_26_state.msgSpecs.splice(0, N_n_0_26_state.msgSpecs.length - 1)
                    N_n_0_26_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_26_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_26_state.msgSpecs.length; i++) {
                        if (N_n_0_26_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_26_state.msgSpecs[i].send, N_n_0_26_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_26_snds_0(N_n_0_26_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_26", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_26_0_rcvs_0(m) {
                            
                IO_snd_n_0_26_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_26_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }





function N_n_0_28_rcvs_0(m) {
                            
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

                    N_n_0_28_state.msgSpecs.splice(0, N_n_0_28_state.msgSpecs.length - 1)
                    N_n_0_28_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_28_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_28_state.msgSpecs.length; i++) {
                        if (N_n_0_28_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_28_state.msgSpecs[i].send, N_n_0_28_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_28_snds_0(N_n_0_28_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_28", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_28_0_rcvs_0(m) {
                            
                IO_snd_n_0_28_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_28_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_29_rcvs_0(m) {
                            
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

                    N_n_0_29_state.msgSpecs.splice(0, N_n_0_29_state.msgSpecs.length - 1)
                    N_n_0_29_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_29_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_29_state.msgSpecs.length; i++) {
                        if (N_n_0_29_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_29_state.msgSpecs[i].send, N_n_0_29_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_29_snds_0(N_n_0_29_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_29", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_29_0_rcvs_0(m) {
                            
                IO_snd_n_0_29_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_29_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_30_rcvs_0(m) {
                            
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

                    N_n_0_30_state.msgSpecs.splice(0, N_n_0_30_state.msgSpecs.length - 1)
                    N_n_0_30_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_30_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_30_state.msgSpecs.length; i++) {
                        if (N_n_0_30_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_30_state.msgSpecs[i].send, N_n_0_30_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_30_snds_0(N_n_0_30_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_30", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_30_0_rcvs_0(m) {
                            
                IO_snd_n_0_30_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_30_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_12_1_1_sig_outs_0 = 0

let N_n_12_1_outs_0 = 0

let N_n_12_15_outs_0 = 0

let N_m_n_13_1_1_sig_outs_0 = 0

let N_n_13_1_outs_0 = 0





let N_m_n_13_10_0_sig_outs_0 = 0

let N_n_13_10_outs_0 = 0













let N_n_0_1_outs_0 = 0



function N_n_0_2_snds_0(m) {
                        N_n_13_11_rcvs_0(m)
N_n_13_12_rcvs_0(m)
N_n_ioSnd_n_0_2_0_rcvs_0(m)
                    }
function N_m_n_13_1_0__routemsg_snds_0(m) {
                        N_m_n_13_1_0_sig_rcvs_0(m)
COLD_2(m)
                    }
function N_n_0_9_snds_0(m) {
                        N_n_0_11_rcvs_0(m)
N_n_ioSnd_n_0_9_0_rcvs_0(m)
                    }
function N_n_0_10_snds_0(m) {
                        N_n_0_13_rcvs_0(m)
N_n_ioSnd_n_0_10_0_rcvs_0(m)
                    }
function N_m_n_12_1_0__routemsg_snds_0(m) {
                        N_m_n_12_1_0_sig_rcvs_0(m)
COLD_0(m)
                    }
function N_n_2_17_snds_0(m) {
                        N_n_7_0_rcvs_0(m)
N_n_7_1_rcvs_0(m)
N_n_7_2_rcvs_0(m)
N_n_7_3_rcvs_0(m)
                    }
function N_n_2_19_snds_0(m) {
                        N_n_2_12_rcvs_1(m)
N_n_2_16_rcvs_1(m)
                    }
function N_n_0_8_snds_0(m) {
                        N_n_0_31_rcvs_0(m)
N_n_ioSnd_n_0_8_0_rcvs_0(m)
                    }
function N_n_0_27_snds_0(m) {
                        N_n_1_6_rcvs_0(m)
N_n_ioSnd_n_0_27_0_rcvs_0(m)
                    }
function N_n_1_6_snds_0(m) {
                        N_n_2_14_rcvs_0(m)
N_n_2_17_rcvs_0(m)
                    }
function N_n_7_4_snds_0(m) {
                        N_n_8_1_rcvs_0(m)
N_n_8_4_rcvs_0(m)
                    }
function N_n_7_4_snds_1(m) {
                        N_n_9_1_rcvs_0(m)
N_n_9_4_rcvs_0(m)
                    }
function N_n_7_4_snds_2(m) {
                        N_n_10_1_rcvs_0(m)
N_n_10_4_rcvs_0(m)
                    }
function N_n_7_4_snds_3(m) {
                        N_n_11_1_rcvs_0(m)
N_n_11_4_rcvs_0(m)
                    }
function N_n_8_4_snds_0(m) {
                        N_n_7_1_rcvs_1(m)
N_n_7_2_rcvs_1(m)
N_n_7_3_rcvs_1(m)
                    }
function N_n_9_4_snds_0(m) {
                        N_n_7_0_rcvs_1(m)
N_n_7_2_rcvs_1(m)
N_n_7_3_rcvs_1(m)
                    }
function N_n_10_4_snds_0(m) {
                        N_n_7_0_rcvs_1(m)
N_n_7_1_rcvs_1(m)
N_n_7_3_rcvs_1(m)
                    }
function N_n_11_4_snds_0(m) {
                        N_n_7_0_rcvs_1(m)
N_n_7_1_rcvs_1(m)
N_n_7_2_rcvs_1(m)
                    }
function N_n_0_15_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_15_0_rcvs_0(m)
                    }
function N_n_0_16_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_16_0_rcvs_0(m)
                    }
function N_n_0_17_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_17_0_rcvs_0(m)
                    }
function N_n_0_18_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_18_0_rcvs_0(m)
                    }
function N_n_0_19_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_19_0_rcvs_0(m)
                    }
function N_n_0_20_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_20_0_rcvs_0(m)
                    }
function N_n_0_21_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_21_0_rcvs_0(m)
                    }
function N_n_0_22_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_22_0_rcvs_0(m)
                    }
function N_n_0_23_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_23_0_rcvs_0(m)
                    }
function N_n_0_24_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_24_0_rcvs_0(m)
                    }
function N_n_0_25_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_25_0_rcvs_0(m)
                    }
function N_n_0_26_snds_0(m) {
                        N_n_2_15_rcvs_0(m)
N_n_ioSnd_n_0_26_0_rcvs_0(m)
                    }
function N_n_0_28_snds_0(m) {
                        N_n_1_6_rcvs_0(m)
N_n_ioSnd_n_0_28_0_rcvs_0(m)
                    }
function N_n_0_29_snds_0(m) {
                        N_n_1_6_rcvs_0(m)
N_n_ioSnd_n_0_29_0_rcvs_0(m)
                    }
function N_n_0_30_snds_0(m) {
                        N_n_1_6_rcvs_0(m)
N_n_ioSnd_n_0_30_0_rcvs_0(m)
                    }

        function COLD_0(m) {
                    N_m_n_12_1_0_sig_outs_0 = N_m_n_12_1_0_sig_state.currentValue
                    
                }
function COLD_1(m) {
                    N_m_n_12_1_1_sig_outs_0 = N_m_n_12_1_1_sig_state.currentValue
                    NT_lop_t_setFreq(N_n_12_1_state, N_m_n_12_1_1_sig_outs_0)
                }
function COLD_2(m) {
                    N_m_n_13_1_0_sig_outs_0 = N_m_n_13_1_0_sig_state.currentValue
                    
                }
function COLD_3(m) {
                    N_m_n_13_1_1_sig_outs_0 = N_m_n_13_1_1_sig_state.currentValue
                    NT_lop_t_setFreq(N_n_13_1_state, N_m_n_13_1_1_sig_outs_0)
                }
function COLD_4(m) {
                    N_m_n_13_10_0_sig_outs_0 = N_m_n_13_10_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_13_10_state, N_m_n_13_10_0_sig_outs_0)
                }
        function IO_rcv_n_0_2_0(m) {
                    N_n_0_2_rcvs_0(m)
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
function IO_rcv_n_0_20_0(m) {
                    N_n_0_20_rcvs_0(m)
                }
function IO_rcv_n_0_21_0(m) {
                    N_n_0_21_rcvs_0(m)
                }
function IO_rcv_n_0_22_0(m) {
                    N_n_0_22_rcvs_0(m)
                }
function IO_rcv_n_0_23_0(m) {
                    N_n_0_23_rcvs_0(m)
                }
function IO_rcv_n_0_24_0(m) {
                    N_n_0_24_rcvs_0(m)
                }
function IO_rcv_n_0_25_0(m) {
                    N_n_0_25_rcvs_0(m)
                }
function IO_rcv_n_0_26_0(m) {
                    N_n_0_26_rcvs_0(m)
                }
function IO_rcv_n_0_27_0(m) {
                    N_n_0_27_rcvs_0(m)
                }
function IO_rcv_n_0_28_0(m) {
                    N_n_0_28_rcvs_0(m)
                }
function IO_rcv_n_0_29_0(m) {
                    N_n_0_29_rcvs_0(m)
                }
function IO_rcv_n_0_30_0(m) {
                    N_n_0_30_rcvs_0(m)
                }
        const IO_snd_n_0_2_0 = (m) => {exports.io.messageSenders['n_0_2']['0'](m)}
const IO_snd_n_0_8_0 = (m) => {exports.io.messageSenders['n_0_8']['0'](m)}
const IO_snd_n_0_9_0 = (m) => {exports.io.messageSenders['n_0_9']['0'](m)}
const IO_snd_n_0_10_0 = (m) => {exports.io.messageSenders['n_0_10']['0'](m)}
const IO_snd_n_0_15_0 = (m) => {exports.io.messageSenders['n_0_15']['0'](m)}
const IO_snd_n_0_16_0 = (m) => {exports.io.messageSenders['n_0_16']['0'](m)}
const IO_snd_n_0_17_0 = (m) => {exports.io.messageSenders['n_0_17']['0'](m)}
const IO_snd_n_0_18_0 = (m) => {exports.io.messageSenders['n_0_18']['0'](m)}
const IO_snd_n_0_19_0 = (m) => {exports.io.messageSenders['n_0_19']['0'](m)}
const IO_snd_n_0_20_0 = (m) => {exports.io.messageSenders['n_0_20']['0'](m)}
const IO_snd_n_0_21_0 = (m) => {exports.io.messageSenders['n_0_21']['0'](m)}
const IO_snd_n_0_22_0 = (m) => {exports.io.messageSenders['n_0_22']['0'](m)}
const IO_snd_n_0_23_0 = (m) => {exports.io.messageSenders['n_0_23']['0'](m)}
const IO_snd_n_0_24_0 = (m) => {exports.io.messageSenders['n_0_24']['0'](m)}
const IO_snd_n_0_25_0 = (m) => {exports.io.messageSenders['n_0_25']['0'](m)}
const IO_snd_n_0_26_0 = (m) => {exports.io.messageSenders['n_0_26']['0'](m)}
const IO_snd_n_0_27_0 = (m) => {exports.io.messageSenders['n_0_27']['0'](m)}
const IO_snd_n_0_28_0 = (m) => {exports.io.messageSenders['n_0_28']['0'](m)}
const IO_snd_n_0_29_0 = (m) => {exports.io.messageSenders['n_0_29']['0'](m)}
const IO_snd_n_0_30_0 = (m) => {exports.io.messageSenders['n_0_30']['0'](m)}

        const exports = {
            metadata: {"libVersion":"0.1.0","customMetadata":{"pdNodes":{"0":{"2":{"id":"2","type":"hsl","args":[0.01,0.5,0,0.01,"",""],"nodeClass":"control","layout":{"x":209,"y":386,"width":172,"height":20,"log":0,"label":"vol","labelX":-2,"labelY":-10,"labelFont":"0","labelFontSize":12,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#00ffff","steadyOnClick":"1"}},"3":{"id":"3","type":"text","args":["input p5js"],"nodeClass":"text","layout":{"x":483,"y":100,"width":9}},"8":{"id":"8","type":"msg","args":[0],"nodeClass":"control","layout":{"x":75,"y":101}},"9":{"id":"9","type":"vsl","args":[-1,1,0,-1,"",""],"nodeClass":"control","layout":{"x":454,"y":151,"width":17,"height":128,"log":0,"label":"rX","labelX":0,"labelY":-9,"labelFont":"0","labelFontSize":10,"bgColor":"#191919","fgColor":"#e1e1e1","labelColor":"#00e1e1","steadyOnClick":"1"}},"10":{"id":"10","type":"vsl","args":[-1,1,0,-1,"",""],"nodeClass":"control","layout":{"x":515,"y":151,"width":17,"height":128,"log":0,"label":"rZ","labelX":0,"labelY":-9,"labelFont":"0","labelFontSize":10,"bgColor":"#191919","fgColor":"#e1e1e1","labelColor":"#00e1e1","steadyOnClick":"1"}},"15":{"id":"15","type":"msg","args":[0],"nodeClass":"control","layout":{"x":141,"y":137}},"16":{"id":"16","type":"msg","args":[1],"nodeClass":"control","layout":{"x":159,"y":111}},"17":{"id":"17","type":"msg","args":[2],"nodeClass":"control","layout":{"x":175,"y":137}},"18":{"id":"18","type":"msg","args":[3],"nodeClass":"control","layout":{"x":191,"y":111}},"19":{"id":"19","type":"msg","args":[4],"nodeClass":"control","layout":{"x":212,"y":137}},"20":{"id":"20","type":"msg","args":[5],"nodeClass":"control","layout":{"x":246,"y":137}},"21":{"id":"21","type":"msg","args":[6],"nodeClass":"control","layout":{"x":264,"y":111}},"22":{"id":"22","type":"msg","args":[7],"nodeClass":"control","layout":{"x":280,"y":137}},"23":{"id":"23","type":"msg","args":[8],"nodeClass":"control","layout":{"x":296,"y":111}},"24":{"id":"24","type":"msg","args":[9],"nodeClass":"control","layout":{"x":317,"y":137}},"25":{"id":"25","type":"msg","args":[10],"nodeClass":"control","layout":{"x":328,"y":111}},"26":{"id":"26","type":"msg","args":[11],"nodeClass":"control","layout":{"x":351,"y":137}},"27":{"id":"27","type":"msg","args":[0],"nodeClass":"control","layout":{"x":130,"y":205}},"28":{"id":"28","type":"msg","args":[1],"nodeClass":"control","layout":{"x":164,"y":205}},"29":{"id":"29","type":"msg","args":[2],"nodeClass":"control","layout":{"x":199,"y":205}},"30":{"id":"30","type":"msg","args":[3],"nodeClass":"control","layout":{"x":231,"y":205}}}},"graph":{"n_0_2":{"id":"n_0_2","type":"hsl","args":{"minValue":0.01,"maxValue":0.5,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_0_12","portletId":"0"},{"nodeId":"n_ioRcv_n_0_2_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_13_11","portletId":"0"},{"nodeId":"n_13_12","portletId":"0"},{"nodeId":"n_ioSnd_n_0_2_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_8":{"id":"n_0_8","type":"msg","args":{"msgSpecs":[{"tokens":[0],"send":null}]},"sources":{"0":[{"nodeId":"n_14_2","portletId":"1"},{"nodeId":"n_ioRcv_n_0_8_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_31","portletId":"0"},{"nodeId":"n_ioSnd_n_0_8_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_9":{"id":"n_0_9","type":"vsl","args":{"minValue":-1,"maxValue":1,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_9_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_11","portletId":"0"},{"nodeId":"n_ioSnd_n_0_9_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_10":{"id":"n_0_10","type":"vsl","args":{"minValue":-1,"maxValue":1,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_10_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_13","portletId":"0"},{"nodeId":"n_ioSnd_n_0_10_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_15":{"id":"n_0_15","type":"msg","args":{"msgSpecs":[{"tokens":[0],"send":null}]},"sources":{"0":[{"nodeId":"n_0_31","portletId":"1"},{"nodeId":"n_ioRcv_n_0_15_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_15_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_16":{"id":"n_0_16","type":"msg","args":{"msgSpecs":[{"tokens":[1],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_16_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_16_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_17":{"id":"n_0_17","type":"msg","args":{"msgSpecs":[{"tokens":[2],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_17_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_17_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_18":{"id":"n_0_18","type":"msg","args":{"msgSpecs":[{"tokens":[3],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_18_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_18_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_19":{"id":"n_0_19","type":"msg","args":{"msgSpecs":[{"tokens":[4],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_19_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_19_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_20":{"id":"n_0_20","type":"msg","args":{"msgSpecs":[{"tokens":[5],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_20_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_20_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_21":{"id":"n_0_21","type":"msg","args":{"msgSpecs":[{"tokens":[6],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_21_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_21_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_22":{"id":"n_0_22","type":"msg","args":{"msgSpecs":[{"tokens":[7],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_22_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_22_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_23":{"id":"n_0_23","type":"msg","args":{"msgSpecs":[{"tokens":[8],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_23_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_23_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_24":{"id":"n_0_24","type":"msg","args":{"msgSpecs":[{"tokens":[9],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_24_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_24_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_25":{"id":"n_0_25","type":"msg","args":{"msgSpecs":[{"tokens":[10],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_25_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_25_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_26":{"id":"n_0_26","type":"msg","args":{"msgSpecs":[{"tokens":[11],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_26_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_2_15","portletId":"0"},{"nodeId":"n_ioSnd_n_0_26_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_27":{"id":"n_0_27","type":"msg","args":{"msgSpecs":[{"tokens":[0],"send":null}]},"sources":{"0":[{"nodeId":"n_0_31","portletId":"0"},{"nodeId":"n_ioRcv_n_0_27_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_1_6","portletId":"0"},{"nodeId":"n_ioSnd_n_0_27_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_28":{"id":"n_0_28","type":"msg","args":{"msgSpecs":[{"tokens":[1],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_28_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_1_6","portletId":"0"},{"nodeId":"n_ioSnd_n_0_28_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_29":{"id":"n_0_29","type":"msg","args":{"msgSpecs":[{"tokens":[2],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_29_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_1_6","portletId":"0"},{"nodeId":"n_ioSnd_n_0_29_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_30":{"id":"n_0_30","type":"msg","args":{"msgSpecs":[{"tokens":[3],"send":null}]},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_30_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_1_6","portletId":"0"},{"nodeId":"n_ioSnd_n_0_30_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}}},"pdGui":[{"nodeClass":"control","patchId":"0","pdNodeId":"2","nodeId":"n_0_2"},{"nodeClass":"text","patchId":"0","pdNodeId":"3"},{"nodeClass":"control","patchId":"0","pdNodeId":"8","nodeId":"n_0_8"},{"nodeClass":"control","patchId":"0","pdNodeId":"9","nodeId":"n_0_9"},{"nodeClass":"control","patchId":"0","pdNodeId":"10","nodeId":"n_0_10"},{"nodeClass":"control","patchId":"0","pdNodeId":"15","nodeId":"n_0_15"},{"nodeClass":"control","patchId":"0","pdNodeId":"16","nodeId":"n_0_16"},{"nodeClass":"control","patchId":"0","pdNodeId":"17","nodeId":"n_0_17"},{"nodeClass":"control","patchId":"0","pdNodeId":"18","nodeId":"n_0_18"},{"nodeClass":"control","patchId":"0","pdNodeId":"19","nodeId":"n_0_19"},{"nodeClass":"control","patchId":"0","pdNodeId":"20","nodeId":"n_0_20"},{"nodeClass":"control","patchId":"0","pdNodeId":"21","nodeId":"n_0_21"},{"nodeClass":"control","patchId":"0","pdNodeId":"22","nodeId":"n_0_22"},{"nodeClass":"control","patchId":"0","pdNodeId":"23","nodeId":"n_0_23"},{"nodeClass":"control","patchId":"0","pdNodeId":"24","nodeId":"n_0_24"},{"nodeClass":"control","patchId":"0","pdNodeId":"25","nodeId":"n_0_25"},{"nodeClass":"control","patchId":"0","pdNodeId":"26","nodeId":"n_0_26"},{"nodeClass":"control","patchId":"0","pdNodeId":"27","nodeId":"n_0_27"},{"nodeClass":"control","patchId":"0","pdNodeId":"28","nodeId":"n_0_28"},{"nodeClass":"control","patchId":"0","pdNodeId":"29","nodeId":"n_0_29"},{"nodeClass":"control","patchId":"0","pdNodeId":"30","nodeId":"n_0_30"}]},"settings":{"audio":{"channelCount":{"in":2,"out":2},"bitDepth":64,"sampleRate":0,"blockSize":0},"io":{"messageReceivers":{"n_0_2":["0"],"n_0_8":["0"],"n_0_9":["0"],"n_0_10":["0"],"n_0_15":["0"],"n_0_16":["0"],"n_0_17":["0"],"n_0_18":["0"],"n_0_19":["0"],"n_0_20":["0"],"n_0_21":["0"],"n_0_22":["0"],"n_0_23":["0"],"n_0_24":["0"],"n_0_25":["0"],"n_0_26":["0"],"n_0_27":["0"],"n_0_28":["0"],"n_0_29":["0"],"n_0_30":["0"]},"messageSenders":{"n_0_2":["0"],"n_0_8":["0"],"n_0_9":["0"],"n_0_10":["0"],"n_0_15":["0"],"n_0_16":["0"],"n_0_17":["0"],"n_0_18":["0"],"n_0_19":["0"],"n_0_20":["0"],"n_0_21":["0"],"n_0_22":["0"],"n_0_23":["0"],"n_0_24":["0"],"n_0_25":["0"],"n_0_26":["0"],"n_0_27":["0"],"n_0_28":["0"],"n_0_29":["0"],"n_0_30":["0"]}}},"compilation":{"variableNamesIndex":{"io":{"messageReceivers":{"n_0_2":{"0":"IO_rcv_n_0_2_0"},"n_0_8":{"0":"IO_rcv_n_0_8_0"},"n_0_9":{"0":"IO_rcv_n_0_9_0"},"n_0_10":{"0":"IO_rcv_n_0_10_0"},"n_0_15":{"0":"IO_rcv_n_0_15_0"},"n_0_16":{"0":"IO_rcv_n_0_16_0"},"n_0_17":{"0":"IO_rcv_n_0_17_0"},"n_0_18":{"0":"IO_rcv_n_0_18_0"},"n_0_19":{"0":"IO_rcv_n_0_19_0"},"n_0_20":{"0":"IO_rcv_n_0_20_0"},"n_0_21":{"0":"IO_rcv_n_0_21_0"},"n_0_22":{"0":"IO_rcv_n_0_22_0"},"n_0_23":{"0":"IO_rcv_n_0_23_0"},"n_0_24":{"0":"IO_rcv_n_0_24_0"},"n_0_25":{"0":"IO_rcv_n_0_25_0"},"n_0_26":{"0":"IO_rcv_n_0_26_0"},"n_0_27":{"0":"IO_rcv_n_0_27_0"},"n_0_28":{"0":"IO_rcv_n_0_28_0"},"n_0_29":{"0":"IO_rcv_n_0_29_0"},"n_0_30":{"0":"IO_rcv_n_0_30_0"}},"messageSenders":{"n_0_2":{"0":"IO_snd_n_0_2_0"},"n_0_8":{"0":"IO_snd_n_0_8_0"},"n_0_9":{"0":"IO_snd_n_0_9_0"},"n_0_10":{"0":"IO_snd_n_0_10_0"},"n_0_15":{"0":"IO_snd_n_0_15_0"},"n_0_16":{"0":"IO_snd_n_0_16_0"},"n_0_17":{"0":"IO_snd_n_0_17_0"},"n_0_18":{"0":"IO_snd_n_0_18_0"},"n_0_19":{"0":"IO_snd_n_0_19_0"},"n_0_20":{"0":"IO_snd_n_0_20_0"},"n_0_21":{"0":"IO_snd_n_0_21_0"},"n_0_22":{"0":"IO_snd_n_0_22_0"},"n_0_23":{"0":"IO_snd_n_0_23_0"},"n_0_24":{"0":"IO_snd_n_0_24_0"},"n_0_25":{"0":"IO_snd_n_0_25_0"},"n_0_26":{"0":"IO_snd_n_0_26_0"},"n_0_27":{"0":"IO_snd_n_0_27_0"},"n_0_28":{"0":"IO_snd_n_0_28_0"},"n_0_29":{"0":"IO_snd_n_0_29_0"},"n_0_30":{"0":"IO_snd_n_0_30_0"}}},"globals":{"commons":{"getArray":"G_commons_getArray","setArray":"G_commons_setArray"}}}}},
            initialize: (sampleRate, blockSize) => {
                exports.metadata.settings.audio.sampleRate = sampleRate
                exports.metadata.settings.audio.blockSize = blockSize
                SAMPLE_RATE = sampleRate
                BLOCK_SIZE = blockSize

                
                N_n_0_2_state.messageSender = N_n_0_2_snds_0
                N_n_0_2_state.messageReceiver = function (m) {
                    NT_hsl_receiveMessage(N_n_0_2_state, m)
                }
                NT_hsl_setReceiveBusName(N_n_0_2_state, "empty")
    
                
            

            NT_neq_setLeft(N_n_13_11_state, 0)
            NT_neq_setRight(N_n_13_11_state, 0.01)
        

            NT_mul_setLeft(N_n_13_12_state, 0)
            NT_mul_setRight(N_n_13_12_state, 1)
        

            N_n_13_2_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_13_2_state.msgSpecs[0].outTemplate = []

                N_n_13_2_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_13_2_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            

                N_n_13_2_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_13_2_state.msgSpecs[0].outMessage = G_msg_create(N_n_13_2_state.msgSpecs[0].outTemplate)

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_13_2_state.msgSpecs[0].outMessage, 0, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_13_2_state.msgSpecs[0].outMessage, 0, stringMem[0])
                }
            

                G_msg_writeFloatToken(N_n_13_2_state.msgSpecs[0].outMessage, 1, 30)
            
                            return N_n_13_2_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        

            NT_line_setGrain(N_n_13_0_state, 20)
            N_n_13_0_state.snd0 = N_m_n_13_1_0__routemsg_rcvs_0
            N_n_13_0_state.tickCallback = function () {
                NT_line_tick(N_n_13_0_state)
            }
        




                N_n_0_9_state.messageSender = N_n_0_9_snds_0
                N_n_0_9_state.messageReceiver = function (m) {
                    NT_vsl_receiveMessage(N_n_0_9_state, m)
                }
                NT_vsl_setReceiveBusName(N_n_0_9_state, "empty")
    
                
            

            NT_add_setLeft(N_n_0_11_state, 0)
            NT_add_setRight(N_n_0_11_state, 1)
        

            NT_mul_setLeft(N_n_0_12_state, 0)
            NT_mul_setRight(N_n_0_12_state, 0.25)
        


                N_n_0_10_state.messageSender = N_n_0_10_snds_0
                N_n_0_10_state.messageReceiver = function (m) {
                    NT_vsl_receiveMessage(N_n_0_10_state, m)
                }
                NT_vsl_setReceiveBusName(N_n_0_10_state, "empty")
    
                
            

            NT_add_setLeft(N_n_0_13_state, 0)
            NT_add_setRight(N_n_0_13_state, 1)
        

            NT_mul_setLeft(N_n_0_14_state, 0)
            NT_mul_setRight(N_n_0_14_state, 0.5)
        

            NT_mul_setLeft(N_n_0_32_state, 0)
            NT_mul_setRight(N_n_0_32_state, 1)
        

            NT_int_setValue(N_n_12_0_state, 0)
        

        if (N_n_12_11_state.arrayName.length) {
            NT_tabread_setArrayName(
                N_n_12_11_state, 
                N_n_12_11_state.arrayName,
                () => NT_tabread_setArrayNameFinalize(N_n_12_11_state)
            )
        }
    




            NT_float_setValue(N_n_2_17_state, 0)
        




            N_n_3_12_state.floatInputs.set(0, 0)
            
        


        if (N_n_2_16_state.arrayName.length) {
            NT_tabwrite_setArrayName(
                N_n_2_16_state, 
                N_n_2_16_state.arrayName,
                () => NT_tabwrite_setArrayNameFinalize(N_n_2_16_state)
            )
        }
    

            N_n_2_13_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_13_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_13_state.msgSpecs[0].outTemplate = []

                N_n_2_13_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_13_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_13_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_13_state.msgSpecs[0].outMessage, 0, 1)
            
        

            NT_add_setLeft(N_n_2_12_state, 0)
            NT_add_setRight(N_n_2_12_state, -1)
        

            NT_int_setValue(N_n_2_19_state, 0)
        

            N_n_3_11_state.floatInputs.set(0, 0)
            
        

            N_n_3_10_state.floatInputs.set(0, 0)
            
        

            N_n_3_7_state.floatInputs.set(0, 0)
            
        

            N_n_3_6_state.floatInputs.set(0, 0)
            
        

            N_n_3_2_state.floatInputs.set(0, 0)
            
        

            N_n_3_0_state.floatInputs.set(0, 0)
            
        

            NT_float_setValue(N_n_3_19_state, 0)
        




            N_n_4_9_state.floatInputs.set(0, 0)
            
        

            N_n_4_14_state.floatInputs.set(0, 0)
            
        

            N_n_4_13_state.floatInputs.set(0, 0)
            
        

            N_n_4_6_state.floatInputs.set(0, 0)
            
        

            N_n_4_5_state.floatInputs.set(0, 0)
            
        

            N_n_4_12_state.floatInputs.set(0, 0)
            
        

            N_n_4_0_state.floatInputs.set(0, 0)
            
        

            NT_float_setValue(N_n_4_19_state, 0)
        



            NT_add_setLeft(N_n_5_9_state, 0)
            NT_add_setRight(N_n_5_9_state, 12)
        


            NT_add_setLeft(N_n_5_8_state, 0)
            NT_add_setRight(N_n_5_8_state, 9)
        


            NT_add_setLeft(N_n_5_7_state, 0)
            NT_add_setRight(N_n_5_7_state, 7)
        


            NT_add_setLeft(N_n_5_6_state, 0)
            NT_add_setRight(N_n_5_6_state, 4)
        


            NT_add_setLeft(N_n_5_5_state, 0)
            NT_add_setRight(N_n_5_5_state, 2)
        





            NT_add_setLeft(N_n_6_4_state, 0)
            NT_add_setRight(N_n_6_4_state, 12)
        


            NT_add_setLeft(N_n_6_16_state, 0)
            NT_add_setRight(N_n_6_16_state, 10)
        


            NT_add_setLeft(N_n_6_3_state, 0)
            NT_add_setRight(N_n_6_3_state, 7)
        


            NT_add_setLeft(N_n_6_15_state, 0)
            NT_add_setRight(N_n_6_15_state, 5)
        


            NT_add_setLeft(N_n_6_12_state, 0)
            NT_add_setRight(N_n_6_12_state, 3)
        


G_commons_waitFrame(0, () => N_n_12_6_rcvs_0(G_bangUtils_bang()))

        N_n_12_6_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_12_6_state, 50)
    

            N_n_12_16_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_12_16_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_12_16_state.msgSpecs[0].outTemplate = []

                N_n_12_16_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_12_16_state.msgSpecs[0].outMessage = G_msg_create(N_n_12_16_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_12_16_state.msgSpecs[0].outMessage, 0, 0)
            
        

            G_msgBuses_subscribe("noteCtrl", N_n_12_10_rcvs_0)
        

            NT_mul_setLeft(N_n_12_10_state, 0)
            NT_mul_setRight(N_n_12_10_state, 1)
        

            G_msgBuses_subscribe("noteSliderRange", G_msg_VOID_MESSAGE_RECEIVER)
        

            G_msgBuses_subscribe("noteCtrlMultiplier", N_n_12_10_rcvs_1)
        
G_commons_waitFrame(0, () => N_n_14_2_rcvs_0(G_bangUtils_bang()))


            N_n_14_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_14_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "pd",
                        hasSend: true,
                    },
            ]

            
        
        
        
    
N_n_14_1_state.msgSpecs[0].outTemplate = []

                N_n_14_1_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_14_1_state.msgSpecs[0].outTemplate.push(3)
            

                N_n_14_1_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_14_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_14_1_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_14_1_state.msgSpecs[0].outMessage, 0, "dsp")
            

                G_msg_writeFloatToken(N_n_14_1_state.msgSpecs[0].outMessage, 1, 1)
            
        

            N_n_0_8_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_8_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_8_state.msgSpecs[0].outTemplate = []

                N_n_0_8_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_8_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_8_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_8_state.msgSpecs[0].outMessage, 0, 0)
            
        


            N_n_0_27_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_27_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_27_state.msgSpecs[0].outTemplate = []

                N_n_0_27_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_27_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_27_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_27_state.msgSpecs[0].outMessage, 0, 0)
            
        


            N_n_2_14_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_14_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_14_state.msgSpecs[0].outTemplate = []

                N_n_2_14_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_14_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_14_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_14_state.msgSpecs[0].outMessage, 0, -1)
            
        



            N_n_1_9_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_1_9_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_1_9_state.msgSpecs[0].outTemplate = []

                N_n_1_9_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_1_9_state.msgSpecs[0].outMessage = G_msg_create(N_n_1_9_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_1_9_state.msgSpecs[0].outMessage, 0, 0)
            
        


            N_n_8_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_8_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_8_1_state.msgSpecs[0].outTemplate = []

                N_n_8_1_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_8_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_8_1_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_8_1_state.msgSpecs[0].outMessage, 0, 1)
            
        

            N_n_8_4_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_8_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_8_4_state.msgSpecs[0].outTemplate = []

                N_n_8_4_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_8_4_state.msgSpecs[0].outMessage = G_msg_create(N_n_8_4_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_8_4_state.msgSpecs[0].outMessage, 0, 0)
            
        

            N_n_9_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_9_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_9_1_state.msgSpecs[0].outTemplate = []

                N_n_9_1_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_9_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_9_1_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_9_1_state.msgSpecs[0].outMessage, 0, 1)
            
        

            N_n_9_4_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_9_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_9_4_state.msgSpecs[0].outTemplate = []

                N_n_9_4_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_9_4_state.msgSpecs[0].outMessage = G_msg_create(N_n_9_4_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_9_4_state.msgSpecs[0].outMessage, 0, 0)
            
        

            N_n_10_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_10_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_10_1_state.msgSpecs[0].outTemplate = []

                N_n_10_1_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_10_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_10_1_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_10_1_state.msgSpecs[0].outMessage, 0, 1)
            
        

            N_n_10_4_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_10_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_10_4_state.msgSpecs[0].outTemplate = []

                N_n_10_4_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_10_4_state.msgSpecs[0].outMessage = G_msg_create(N_n_10_4_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_10_4_state.msgSpecs[0].outMessage, 0, 0)
            
        

            N_n_11_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_11_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_11_1_state.msgSpecs[0].outTemplate = []

                N_n_11_1_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_11_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_11_1_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_11_1_state.msgSpecs[0].outMessage, 0, 1)
            
        

            N_n_11_4_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_11_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_11_4_state.msgSpecs[0].outTemplate = []

                N_n_11_4_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_11_4_state.msgSpecs[0].outMessage = G_msg_create(N_n_11_4_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_11_4_state.msgSpecs[0].outMessage, 0, 0)
            
        

            N_n_1_7_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_1_7_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_1_7_state.msgSpecs[0].outTemplate = []

                N_n_1_7_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_1_7_state.msgSpecs[0].outMessage = G_msg_create(N_n_1_7_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_1_7_state.msgSpecs[0].outMessage, 0, 7)
            
        


            N_n_1_10_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_1_10_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_1_10_state.msgSpecs[0].outTemplate = []

                N_n_1_10_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_1_10_state.msgSpecs[0].outMessage = G_msg_create(N_n_1_10_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_1_10_state.msgSpecs[0].outMessage, 0, 1)
            
        


            N_n_1_11_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_1_11_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_1_11_state.msgSpecs[0].outTemplate = []

                N_n_1_11_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_1_11_state.msgSpecs[0].outMessage = G_msg_create(N_n_1_11_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_1_11_state.msgSpecs[0].outMessage, 0, 2)
            
        

            N_n_1_8_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_1_8_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_1_8_state.msgSpecs[0].outTemplate = []

                N_n_1_8_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_1_8_state.msgSpecs[0].outMessage = G_msg_create(N_n_1_8_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_1_8_state.msgSpecs[0].outMessage, 0, 5)
            
        


            N_n_1_12_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_1_12_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_1_12_state.msgSpecs[0].outTemplate = []

                N_n_1_12_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_1_12_state.msgSpecs[0].outMessage = G_msg_create(N_n_1_12_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_1_12_state.msgSpecs[0].outMessage, 0, 3)
            
        


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

                G_msg_writeFloatToken(N_n_0_15_state.msgSpecs[0].outMessage, 0, 0)
            
        




            N_n_2_0_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_0_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_0_state.msgSpecs[0].outTemplate = []

                N_n_2_0_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_0_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_0_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_0_state.msgSpecs[0].outMessage, 0, 60)
            
        

            NT_add_setLeft(N_n_2_1_state, 0)
            NT_add_setRight(N_n_2_1_state, 0)
        

            N_n_2_4_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_4_state.msgSpecs[0].outTemplate = []

                N_n_2_4_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_4_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_4_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_4_state.msgSpecs[0].outMessage, 0, 0)
            
        










            N_n_0_16_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_16_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_16_state.msgSpecs[0].outTemplate = []

                N_n_0_16_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_16_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_16_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_16_state.msgSpecs[0].outMessage, 0, 1)
            
        



            N_n_0_17_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_17_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_17_state.msgSpecs[0].outTemplate = []

                N_n_0_17_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_17_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_17_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_17_state.msgSpecs[0].outMessage, 0, 2)
            
        



            N_n_0_18_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_18_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_18_state.msgSpecs[0].outTemplate = []

                N_n_0_18_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_18_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_18_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_18_state.msgSpecs[0].outMessage, 0, 3)
            
        



            N_n_0_19_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_19_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_19_state.msgSpecs[0].outTemplate = []

                N_n_0_19_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_19_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_19_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_19_state.msgSpecs[0].outMessage, 0, 4)
            
        



            N_n_0_20_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_20_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_20_state.msgSpecs[0].outTemplate = []

                N_n_0_20_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_20_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_20_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_20_state.msgSpecs[0].outMessage, 0, 5)
            
        



            N_n_0_21_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_21_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_21_state.msgSpecs[0].outTemplate = []

                N_n_0_21_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_21_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_21_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_21_state.msgSpecs[0].outMessage, 0, 6)
            
        



            N_n_0_22_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_22_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_22_state.msgSpecs[0].outTemplate = []

                N_n_0_22_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_22_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_22_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_22_state.msgSpecs[0].outMessage, 0, 7)
            
        



            N_n_0_23_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_23_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_23_state.msgSpecs[0].outTemplate = []

                N_n_0_23_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_23_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_23_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_23_state.msgSpecs[0].outMessage, 0, 8)
            
        



            N_n_0_24_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_24_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_24_state.msgSpecs[0].outTemplate = []

                N_n_0_24_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_24_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_24_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_24_state.msgSpecs[0].outMessage, 0, 9)
            
        



            N_n_0_25_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_25_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_25_state.msgSpecs[0].outTemplate = []

                N_n_0_25_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_25_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_25_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_25_state.msgSpecs[0].outMessage, 0, 10)
            
        



            N_n_0_26_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_26_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_26_state.msgSpecs[0].outTemplate = []

                N_n_0_26_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_26_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_26_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_26_state.msgSpecs[0].outMessage, 0, 11)
            
        




            N_n_0_28_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_28_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_28_state.msgSpecs[0].outTemplate = []

                N_n_0_28_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_28_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_28_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_28_state.msgSpecs[0].outMessage, 0, 1)
            
        



            N_n_0_29_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_29_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_29_state.msgSpecs[0].outTemplate = []

                N_n_0_29_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_29_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_29_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_29_state.msgSpecs[0].outMessage, 0, 2)
            
        



            N_n_0_30_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_30_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_30_state.msgSpecs[0].outTemplate = []

                N_n_0_30_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_30_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_30_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_30_state.msgSpecs[0].outMessage, 0, 3)
            
        




            NT_osc_t_setStep(N_n_12_15_state, 0)
        






            NT_osc_t_setStep(N_n_13_10_state, 0)
        








                COLD_0(G_msg_EMPTY_MESSAGE)
COLD_1(G_msg_EMPTY_MESSAGE)
COLD_2(G_msg_EMPTY_MESSAGE)
COLD_3(G_msg_EMPTY_MESSAGE)
COLD_4(G_msg_EMPTY_MESSAGE)
            },
            dspLoop: (INPUT, OUTPUT) => {
                
        for (IT_FRAME = 0; IT_FRAME < BLOCK_SIZE; IT_FRAME++) {
            G_commons__emitFrame(FRAME)
            N_n_12_1_state.previous = N_n_12_1_outs_0 = N_n_12_1_state.coeff * N_m_n_12_1_0_sig_outs_0 + (1 - N_n_12_1_state.coeff) * N_n_12_1_state.previous
NT_osc_t_setStep(N_n_12_15_state, N_n_12_1_outs_0)

                N_n_12_15_outs_0 = Math.cos(N_n_12_15_state.phase)
                N_n_12_15_state.phase += N_n_12_15_state.step
            
N_n_13_1_state.previous = N_n_13_1_outs_0 = N_n_13_1_state.coeff * N_m_n_13_1_0_sig_outs_0 + (1 - N_n_13_1_state.coeff) * N_n_13_1_state.previous

                N_n_13_10_outs_0 = Math.cos(N_n_13_10_state.phase)
                N_n_13_10_state.phase += N_n_13_10_state.step
            
N_n_0_1_outs_0 = N_n_12_15_outs_0 * ((N_n_13_1_outs_0 * (N_m_n_13_9_1_sig_state.currentValue)) - ((N_n_13_10_outs_0 * (N_m_n_13_6_1_sig_state.currentValue)) * (N_n_13_1_outs_0 * (N_m_n_13_8_1_sig_state.currentValue))))
OUTPUT[0][IT_FRAME] = N_n_0_1_outs_0
OUTPUT[1][IT_FRAME] = N_n_0_1_outs_0
            FRAME++
        }
    
            },
            io: {
                messageReceivers: {
                    n_0_2: {
                            "0": IO_rcv_n_0_2_0,
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
n_0_20: {
                            "0": IO_rcv_n_0_20_0,
                        },
n_0_21: {
                            "0": IO_rcv_n_0_21_0,
                        },
n_0_22: {
                            "0": IO_rcv_n_0_22_0,
                        },
n_0_23: {
                            "0": IO_rcv_n_0_23_0,
                        },
n_0_24: {
                            "0": IO_rcv_n_0_24_0,
                        },
n_0_25: {
                            "0": IO_rcv_n_0_25_0,
                        },
n_0_26: {
                            "0": IO_rcv_n_0_26_0,
                        },
n_0_27: {
                            "0": IO_rcv_n_0_27_0,
                        },
n_0_28: {
                            "0": IO_rcv_n_0_28_0,
                        },
n_0_29: {
                            "0": IO_rcv_n_0_29_0,
                        },
n_0_30: {
                            "0": IO_rcv_n_0_30_0,
                        },
                },
                messageSenders: {
                    n_0_2: {
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
n_0_20: {
                            "0": () => undefined,
                        },
n_0_21: {
                            "0": () => undefined,
                        },
n_0_22: {
                            "0": () => undefined,
                        },
n_0_23: {
                            "0": () => undefined,
                        },
n_0_24: {
                            "0": () => undefined,
                        },
n_0_25: {
                            "0": () => undefined,
                        },
n_0_26: {
                            "0": () => undefined,
                        },
n_0_27: {
                            "0": () => undefined,
                        },
n_0_28: {
                            "0": () => undefined,
                        },
n_0_29: {
                            "0": () => undefined,
                        },
n_0_30: {
                            "0": () => undefined,
                        },
                },
            }
        }

        
exports.G_commons_getArray = G_commons_getArray
exports.G_commons_setArray = G_commons_setArray
    