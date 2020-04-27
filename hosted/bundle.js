"use strict";

var handleCode = function handleCode(e) {
    e.preventDefault();

    $("#codeMessage").animate({ width: 'hide' }, 350);
    if ($("#codeName").val() == '' || $("#codeContent").val() == '') {
        handleError("All fields required");
        return false;
    }

    sendAjax('POST', $("#codeForm").attr("action"), $("#codeForm").serialize(), function () {
        loadCodeFromServer();
    });

    return false;
};

var CodeForm = function CodeForm(props) {
    return React.createElement(
        "form",
        { id: "codeForm", name: "codeForm", onSubmit: handleCode, action: "/maker", method: "POST", className: "codeForm" },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name of Project: "
        ),
        React.createElement("input", { id: "codeName", type: "text", name: "name", placeholder: "Code Name" }),
        React.createElement(
            "label",
            { htmlFor: "codeContent" },
            "Enter code here: "
        ),
        React.createElement("textarea", { id: "codeContent", rows: "20", cols: "50", name: "codeContent", placeholder: "Input code here..." }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeCodeSubmit", type: "submit", value: "Make Code" })
    );
};

var CodeList = function CodeList(props) {
    if (props.code.length === 0) {
        return React.createElement(
            "div",
            { className: "codeList" },
            React.createElement(
                "h3",
                { className: "emptyCode" },
                "No code yet"
            )
        );
    }

    var codeNodes = props.code.map(function (code) {
        var codeName = code.name;
        console.dir(code);
        var codeContent = code.codeContent;
        return React.createElement(
            "div",
            { key: code._id, className: "code" },
            React.createElement(
                "h3",
                { className: "codeName" },
                codeName
            ),
            React.createElement(
                "textarea",
                { className: "codeContent", rows: "20", cols: "50" },
                codeContent
            )
        );
    });

    return React.createElement(
        "div",
        { className: "codeList" },
        codeNodes
    );
};

var loadCodeFromServer = function loadCodeFromServer() {
    sendAjax('GET', '/getCode', null, function (data) {
        ReactDOM.render(React.createElement(CodeList, { code: data.code }), document.querySelector("#code"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(CodeForm, { csrf: csrf }), document.querySelector("#makeCode"));

    ReactDOM.render(React.createElement(CodeList, { code: [] }), document.querySelector("#code"));

    loadCodeFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#codeMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#codeMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            //var messageObj = JSON.parse(xhr.responseText);
            //handleError(messageObj.error);
        }
    });
};
