class ResponseJson {

    constructor(code, message, data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    static SUCCESS(data) {
        return new ResponseJson("success", "", data);
    }

    static ERROR(code, message, data) {
        return new ResponseJson(code, message, data);
    }
}

module.exports =   ResponseJson;
