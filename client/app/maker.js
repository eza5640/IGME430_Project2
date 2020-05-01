const handleCode = (e) => {
    e.preventDefault();

    $("#codeMessage").animate({width:'hide'}, 350);
    if($("#codeName").val() == '' || $("#codeContent").val() == '') {
        handleError("All fields required");
        return false;
    }

    sendAjax('POST', $("#codeForm").attr("action"), $("#codeForm").serialize(), function() {
        loadCodeFromServer();
    });

    return false;
};

const CodeForm = (props) => {
    return (
        <form id="codeForm" name="codeForm" onSubmit={handleCode} action="/maker" method="POST" className="codeForm">
            <input id="codeName" type="text" name="name" placeholder="Project Name" />
            <textarea id="codeContent" rows="20" cols="50" name="codeContent" placeholder="Input code here..."></textarea>
            <input type="hidden" name="_csrf" value = {props.csrf} />
            <input className="makeCodeSubmit" type="submit" value="Make Code" />
        </form>
    );
};

const CodeList = function(props) {
    if(props.code.length === 0)
    {
        return(
            <div className="codeList">
                <h3 className="emptyCode">No code yet</h3>
            </div>
        );
    }

    const codeNodes = props.code.map(function(code) {
        let codeName = code.name;
        console.dir(code);
        let codeContent = code.codeContent;
        return (
            <div key={code._id} className="code">
                <h3 className="codeName">{codeName}</h3>
                <textarea className="codeContent" rows="20" cols="50">{codeContent}</textarea>
            </div>
        );
    });

    return(
        <div className="codeList">
            {codeNodes}
        </div>
    );
};

const loadCodeFromServer = () => {
    sendAjax('GET', '/getCode', null, (data) =>{
        ReactDOM.render(
            <CodeList code={data.code} />,
            document.querySelector("#code")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <CodeForm csrf={csrf} />,
        document.querySelector("#makeCode")
    );

    ReactDOM.render(
        <CodeList code={[]} />,
        document.querySelector("#code")
    );

    loadCodeFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
}

$(document).ready(function() {
    getToken();
});