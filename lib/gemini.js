// Reference: https://github.com/beakerbrowser/beaker

const tokenize = require("./tokenize");
const fetch = require("./fetch");
const toHtml = require("./toHtml");

/** @param {import("electron").Protocol} protocol */
function register(protocol) {
    log("Adding gemini protocol");
    return protocol.registerStringProtocol('gemini', handler);
}

/**
 *
 * @param {import("electron").ProtocolRequest} request
 * @param {(response: string | import("electron").ProtocolResponse) => void} callback
 */
function handler(request, callback) {
    return fetch(request.url)
    .then(response => {
        const tokens = tokenize(response.body);
        const data = toHtml(tokens);

        return callback(data)
    }).catch(err => {
        // TODO prettier error page
        callback({
            statusCode: 400,
            data: `<h1>Failed to load url</h1><pre>${err.toString()}</pre>`
        });
    })
}

module.exports = {register};