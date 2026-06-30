import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const botId = searchParams.get("id") || ""

  if (!botId) {
    return new NextResponse("// Missing bot ID", {
      status: 200,
      headers: { "Content-Type": "application/javascript" },
    })
  }

  const baseUrl = request.nextUrl.origin

  // Fetch public config from your API
  let config
  try {
    const res = await fetch(`${baseUrl}/api/chatbots/${botId}/public`)
    const json = await res.json()
    if (!json.success) throw new Error(json.error)
    config = json.data
  } catch (err) {
    return new NextResponse(`// Failed to load chatbot config: ${err}`, {
      status: 200,
      headers: { "Content-Type": "application/javascript" },
    })
  }

  const isBottom = config.widgetPosition?.includes("bottom") ?? true
  const isRight = config.widgetPosition?.includes("right") ?? true

  const widgetCode = `
(function() {
  var botId = "${config.id}";
  
  if (document.getElementById("chat-widget-" + botId)) return;

  var container = document.createElement("div");
  container.id = "chat-widget-" + botId;
  container.style.position = "fixed";
  container.style.zIndex = "999999";
  container.style.${isBottom ? "bottom" : "top"} = "20px";
  container.style.${isRight ? "right" : "left"} = "20px";

  var chatWindow = document.createElement("div");
  chatWindow.id = "chat-window-" + botId;
  chatWindow.style.display = "none";
  chatWindow.style.position = "absolute";
  chatWindow.style.${isBottom ? "bottom" : "top"} = "70px";
  chatWindow.style.${isRight ? "right" : "left"} = "0px";
  chatWindow.style.width = "380px";
  chatWindow.style.height = "550px";
  chatWindow.style.background = "#ffffff";
  chatWindow.style.borderRadius = "16px";
  chatWindow.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)";
  chatWindow.style.overflow = "hidden";
  chatWindow.style.border = "1px solid #e5e7eb";

  var iframe = document.createElement("iframe");
  iframe.src = "${baseUrl}/chat/" + botId;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  chatWindow.appendChild(iframe);

  var btn = document.createElement("button");
  btn.id = "chat-toggle-" + botId;
  btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  btn.style.width = "60px";
  btn.style.height = "60px";
  btn.style.borderRadius = "50%";
  btn.style.backgroundColor = "${config.primaryColor}";
  btn.style.border = "none";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";

  btn.onmouseenter = function() {
    btn.style.transform = "scale(1.1)";
    btn.style.boxShadow = "0 6px 24px rgba(0,0,0,0.4)";
  };
  btn.onmouseleave = function() {
    btn.style.transform = "scale(1)";
    btn.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
  };

  var isOpen = false;
  btn.onclick = function() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? "block" : "none";
  };

  container.appendChild(chatWindow);
  container.appendChild(btn);
  document.body.appendChild(container);

  console.log("[ChatWidget] Loaded:", "${config.name}", "Color:", "${config.primaryColor}");
})();
  `

  return new NextResponse(widgetCode, {
    headers: {
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Cache-Control": "no-cache",
    },
  })
}