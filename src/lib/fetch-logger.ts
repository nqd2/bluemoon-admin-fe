
const isDev = process.env.NODE_ENV === "test";

if (isDev) {
  const globalAny = global as any;

  // Prevent double patching during hot reloads
  if (!globalAny.__FETCH_LOGGING_PATCHED__) {
    const originalFetch = global.fetch;

    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      const method = init?.method || "GET";

      console.log(`\x1b[36m⚡ [FETCH] ${method} ${url}\x1b[0m`);

      try {
        const response = await originalFetch(input, init);

        // Only log body for non-stream responses or if safely cloneable
        // Note: response.clone() buffers the body. Large downloads might be affected.
        try {
          const clone = response.clone();
          const text = await clone.text();
          
          let bodyDisplay = text;
          try {
            const json = JSON.parse(text);
            // Limit depth/size for readability if needed, or just log full object
            bodyDisplay = json;
          } catch {
            // Truncate long text
            if (text.length > 2000) {
              bodyDisplay = text.substring(0, 2000) + "... (truncated)";
            }
          }

          const statusColor = response.ok ? "\x1b[32m" : "\x1b[31m";
          console.log(`${statusColor}   ⬇️ [${response.status}] ${url}\x1b[0m`);
          
          if (bodyDisplay) {
             // Use console.dir to print objects nicely in terminal
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

