
const isDev = process.env.NODE_ENV === "test";

if (isDev) {
  const globalAny = global as any;
  if (!globalAny.__FETCH_LOGGING_PATCHED__) {
    const originalFetch = global.fetch;

    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      const method = init?.method || "GET";

      console.log(`\x1b[36m⚡ [FETCH] ${method} ${url}\x1b[0m`);

      try {
        const response = await originalFetch(input, init);
        try {
          const clone = response.clone();
          const text = await clone.text();
          
          let bodyDisplay = text;
          try {
            const json = JSON.parse(text);
            bodyDisplay = json;
          } catch {
            if (text.length > 2000) {
              bodyDisplay = text.substring(0, 2000) + "... (truncated)";
            }
          }

          const statusColor = response.ok ? "\x1b[32m" : "\x1b[31m";
          console.log(`${statusColor}   ⬇️ [${response.status}] ${url}\x1b[0m`);
          
          if (bodyDisplay) {
             console.dir(bodyDisplay, { depth: null, colors: true });
          }

        } catch (cloneError) {
          console.log(`   ⬇️ [${response.status}] (Body not readable/streamed)`);
        }

        return response;
      } catch (error) {
        console.log(`\x1b[31m❌ [FETCH ERROR] ${method} ${url}\x1b[0m`, error);
        throw error;
      }
    };

    globalAny.__FETCH_LOGGING_PATCHED__ = true;
    console.log("\x1b[35m🔧 Global fetch logger initialized (Development Mode)\x1b[0m");
  }
}

export {};

