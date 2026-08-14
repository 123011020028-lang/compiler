function toggleTheme() {
    document.body.classList.toggle("light");
}

function convertCode() {
    let input = document.getElementById("inputText").value.toLowerCase();
    let output = "";
    let parseTree = "";

    let numbers = input.match(/\d+/g);
    let words = input.match(/[a-z]+/g);

    // ===== PRINT =====
    if (input.includes("print") && numbers && numbers.length >= 2) {

        let start = numbers[0];
        let end = numbers[1];

        parseTree =
`PRINT
 ├── START: ${start}
 └── END: ${end}`;

        output =
`#include <stdio.h>

int main() {
    for(int i=${start}; i<=${end}; i++) {
        printf("%d\\n", i);
    }
    return 0;
}`;
    }

    // ===== ADD =====
    else if (input.includes("add") || input.includes("sum")) {

        let filtered = words ? words.filter(w => !["add","and","sum","of"].includes(w)) : [];

        if (numbers && numbers.length >= 2) {

            parseTree =
`ADD
 ├── ${numbers[0]}
 └── ${numbers[1]}`;

            output =
`#include <stdio.h>

int main() {
    int result = ${numbers[0]} + ${numbers[1]};
    printf("%d", result);
    return 0;
}`;
        }

        else if (filtered.length >= 2) {

            let a = filtered[0];
            let b = filtered[1];

            parseTree =
`ADD
 ├── ${a}
 └── ${b}`;

            output =
`#include <stdio.h>

int main() {
    int ${a}, ${b};
    scanf("%d %d", &${a}, &${b});
    printf("%d", ${a} + ${b});
    return 0;
}`;
        }
    }

    // ===== EVEN =====
    else if (input.includes("even")) {

        let limit = numbers ? numbers[0] : 10;

        parseTree =
`EVEN_LOOP
 └── LIMIT: ${limit}`;

        output =
`#include <stdio.h>

int main() {
    for(int i=1; i<=${limit}; i++) {
        if(i % 2 == 0) {
            printf("%d\\n", i);
        }
    }
    return 0;
}`;
    }

    // ===== DEFAULT =====
    else {
        parseTree = "UNKNOWN COMMAND";
        output = "// Command not recognized";
    }

    document.getElementById("outputCode").textContent = output;
    document.getElementById("parseTree").textContent = parseTree;

    analyzeCCode(output);
}


// ===== LEXICAL ANALYSIS (YOUR CUSTOM RULES) =====
function analyzeCCode(code) {

    let table = document.getElementById("tokenTable");

    table.innerHTML = `
        <tr>
            <th>Token</th>
            <th>Type</th>
        </tr>
    `;

    // REMOVE #include
    let cleanedCode = code
        .split("\n")
        .filter(line => !line.trim().startsWith("#"))
        .join("\n");

    // Tokenization (with %d support)
    let tokens = cleanedCode.match(/%d|[a-zA-Z_]+|\d+|==|<=|>=|!=|[{}();,.+\-*/%=&<>]/g) || [];

    let keywords = ["int", "return"];
    let functions = ["printf", "scanf"];

    tokens.forEach(token => {

        let type = "";

        if (keywords.includes(token)) {
            type = "KEYWORD";
        }
        else if (functions.includes(token)) {
            type = "PREDEFINED FUNCTION";
        }
        else if (token === ";" || token === ",") {
            type = "PUNCTUATION";
        }
        else if (token === "%d") {
            type = "LITERAL TOKEN";
        }
        else if (token === "=") {
            type = "OPERATOR";
        }
        else if (token === "+") {
            type = "ATTRIBUTES";
        }
        else if (token === "&") {
            type = "ADDRESS OPERATOR";
        }
        else if (token === "(") {
            type = "OPEN PARENTHESIS";
        }
        else if (token === ")") {
            type = "CLOSE PARENTHESIS";
        }
        else if (token === "{") {
            type = "OPEN BRACE";
        }
        else if (token === "}") {
            type = "CLOSE BRACE";
        }
        else if (!isNaN(token)) {
            type = "CONSTANT";
        }
        else if (/^[a-zA-Z_]+$/.test(token)) {
            type = "IDENTIFICATION";
        }

        if (type !== "") {
            let row = `<tr>
                <td>${token}</td>
                <td>${type}</td>
            </tr>`;
            table.innerHTML += row;
        }
    });
}


// ===== COPY =====
function copyCode() {
    let code = document.getElementById("outputCode").textContent;
    navigator.clipboard.writeText(code);
    alert("Code copied!");
}