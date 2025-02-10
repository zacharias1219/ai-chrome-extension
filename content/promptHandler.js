class PromptHandler {
    constructor(result, message) {
      this.initializeApiInfo(result.DATA);
      this.menus = result.MENUS;
      this.message = message;
      this.selectedText = window.getSelection().toString();
      this.promptUi = new PromptUi(message.title);
    }
  
    initializeApiInfo({
      gptEndpoint,
      geminiEndpoint,
      gptKey,
      geminiKey,
      selectedAI,
      grokEndpoint,
      grokKey,
    }) {
      this.openAiEndPoint = gptEndpoint;
      this.geminiEndPoint = geminiEndpoint;
      this.grokEndPoint = grokEndpoint;
  
      this.openAPIKey = gptKey;
      this.geminiAPIKey = geminiKey;
      this.grokAPIKey = grokKey;
  
      this.selectedAI = selectedAI;
    }
  
    // Method to create the API payload based on the selected menu
    createGptPayload() {
      const content = this.getUserContent(this.message);
  
      if (!content) return "";
  
      const payload = {
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content },
        ],
        model: "gpt-4o-mini",
      };
  
      return payload;
    }
  
    createGeminiPayload() {
      const text = this.getUserContent(this.message);
  
      if (!text) return "";
  
      return {
        contents: [
          {
            parts: [{ text }],
          },
        ],
      };
    }
  
    createGrokPayload() {
      const content = this.getUserContent(this.message);
  
      if (!content) return "";
  
      return {
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content },
        ],
        model: "grok-beta",
        stream: false,
        temperature: 0,
      };
    }
  
    createOllamaPayload() {
      const content = this.getUserContent(this.message);
  
      if (!content) return "";
  
      return {
        model: this.selectedAI,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content },
        ],
        stream: false,
      };
    }
  
    // Helper method to generate user content based on the selected menu
    getUserContent(menu) {
      const { correctGrammar, codeReview, generatePost, summarize, askAnything } =
        this.menus;
  
      if (menu.key === correctGrammar.key) {
        return `Correct this text grammatically and give me only the corrected text not any other explanation: ${this.selectedText}`;
      }
  
      if (menu.key === generatePost.key) {
        return `Generate a new post based on the following content: ${this.selectedText}`;
      }
  
      if (menu.key === summarize.key) {
        return `Summarize the following text: ${this.selectedText}`;
      }
  
      if (menu.key === codeReview.key) {
        const reviewPrompt = `
          Please review the following code for the following aspects:
          1. Proper variable naming conventions (e.g., meaningful and descriptive variable names).
          2. Consistency in code formatting (e.g., indentation, spacing, brace placement).
          3. Presence of meaningful comments and documentation explaining non-obvious code.
          4. Efficiency and readability (e.g., avoid unnecessary loops, complex conditionals, or redundant code).
          5. Avoidance of hardcoded values where possible.
          6. Proper error handling and edge case consideration.
          7. Ensure that boundary conditions (e.g., null/undefined checks, empty values) are properly handled.
          8. Redundant code detection (e.g., duplicated logic, unnecessary calculations, or unreachable code).
          
          Here is the code to review:
          \`\`\`
          ${this.selectedText}
          \`\`\`
          
          Please provide a code review based on these criteria. And don't just always give review. If its seems like okay then don't need. If its no then just give me the improved code and the area you improved! not long explanation
          `;
  
        return reviewPrompt;
      }
  
      if (menu.key === askAnything.key) {
        return `Tell me about this: ${this.selectedText}`;
      }
  
      if (menu.key) {
        return `Generate a ${menu.title.toLowerCase()} for social media post which can fit into any of this platform like: X, LinkedIn, Reedit etc: ${
          this.selectedText
        }`;
      }
  
      return "";
    }
  
    // Methods to handle the API call
    callGptApi(payload) {
      this.promptUi.showLoading();
      return fetch(this.openAiEndPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.openAPIKey}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          const result = data.choices[0]?.message?.content || "No response";
          this.promptUi.showModal(`<p>${result}</p>`, result);
        })
        .catch((error) => {
          this.promptUi.showModal(`<p>Error: ${error.message}</p>`);
        })
        .finally(() => {
          this.promptUi.hideLoading();
        });
    }
  
    callGeminiAPI(payload) {
      this.promptUi.showLoading();
      return fetch(`${this.geminiEndPoint}?key=${this.geminiAPIKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          const result =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response from the API.";
          this.promptUi.showModal(`<p>${result}</p>`, result);
        })
        .catch((error) => {
          this.promptUi.showModal(`<p>Error: ${error.message}</p>`);
        })
        .finally(() => {
          this.promptUi.hideLoading();
        });
    }
  
    callGrokAPI(payload) {
      this.promptUi.showLoading();
      return fetch(this.grokEndPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.grokAPIKey}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          const result =
            data?.choices?.[0]?.message?.content || "No response from the API.";
          this.promptUi.showModal(`<p>${result}</p>`, result);
        })
        .catch((error) => {
          this.promptUi.showModal(`<p>Error: ${error.message}</p>`);
        })
        .finally(() => {
          this.promptUi.hideLoading();
        });
    }
  
    callOllamaApi(payload) {
      this.promptUi.showLoading();
      return fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          const result = data.response || "No response";
          this.promptUi.showModal(`<p>${result}</p>`, result);
        })
        .catch((error) => {
          this.promptUi.showModal(`<p>Error: ${error.message}</p>`);
        })
        .finally(() => {
          this.promptUi.hideLoading();
        });
    }
  
    // Main method to handle the menu action and call the API
    handle() {
      try {
        if (!this.selectedText) {
          this.promptUi.showModal(`<p>Please select something</p>`);
          return;
        }
  
        const actionMap = {
          gpt: {
            createPayload: () => this.createGptPayload(),
            callApi: (payload) => this.callGptApi(payload),
          },
          grok: {
            createPayload: () => this.createGrokPayload(),
            callApi: (payload) => this.callGrokAPI(payload),
          },
          gemini: {
            createPayload: () => this.createGeminiPayload(),
            callApi: (payload) => this.callGeminiAPI(payload),
          },
          deepseek: {
            createPayload: () => this.createOllamaPayload(),
            callApi: (payload) => this.callOllamaApi(payload),
          },
        };
  
        const { createPayload, callApi } =
          actionMap[
            this.selectedAI.includes("deepseek") ? "deepseek" : this.selectedAI
          ] || actionMap.gemini;
  
        const payload = createPayload();
  
        callApi(payload);
      } catch (error) {
        this.promptUi.showModal(`<p>Error: ${error.message}</p>`);
      }
    }
  }