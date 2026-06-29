function getParam(name) {
    return new URL(window.location.href).searchParams.get(name) || "匿名用户";
}

const userName = getParam("name");
const textarea = document.getElementById("msg");
const counter = document.getElementById("count");
const counterWrap = counter.parentElement;
const btn = document.getElementById("btn");
const result = document.getElementById("result");

textarea.addEventListener("input", () => {
    const len = textarea.value.length;
    counter.innerText = len;
    if (len >= 50) {
        counterWrap.classList.add("over");
        btn.disabled = true;
    } else {
        counterWrap.classList.remove("over");
        btn.disabled = false;
    }
});

function send() {
    const msg = textarea.value.trim();
    if (!msg) {
        showResult("error", "请输入反馈内容");
        return;
    }

    const finalText = "【用户反馈】\n昵称：" + userName + "\n内容：" + msg;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> 提交中';
    result.style.display = "none";

    const formData = new FormData();
    formData.append("chat_id", "8502329570");
    formData.append("text", finalText);

    fetch("https://api.yuzusoft.pw/tg.go?action=sendMessage", {
        method: "POST",
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.ok || data.status === "success") {
            showResult("success", "提交成功，我们会尽快处理");
            textarea.value = "";
            counter.innerText = "0";
        } else {
            showResult("error", "提交失败：" + JSON.stringify(data));
            resetBtn();
        }
    })
    .catch(() => {
        showResult("error", "请求失败（可能被跨域拦截）");
        resetBtn();
    });
}

function showResult(type, text) {
    result.className = type;
    result.innerText = text;
}

function resetBtn() {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 提交反馈';
}