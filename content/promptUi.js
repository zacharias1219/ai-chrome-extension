class PromptUi {
    constructor(modalTitle) {
      this.modalHTML = `
          <div id="modal-overlay" class="modal-overlay">
            <div class="custom-modal">
              <div class="modal-header">${
                modalTitle || "Hi! How's your day?"
              }</div>
              <div class="modal-content"></div>
              <div class="buttons-container">
                <button id="copy-button">Copy</button>
                <button id="cancel-button">Close</button>
              </div>
            </div>
          </div>
        `;
  
      this.modalCSS = `
          .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
          }
    
          .custom-modal {
            background-color: #fff;
            padding: 20px;
            width: 50%;
            max-width: 600px;
            min-height: 100px;
            max-height: 500px;
            color: black;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border: 1px solid rgb(170, 170, 170);
          }
    
          .modal-content {
            overflow-y: auto;
            max-height: 360px;
          }
    
          .modal-header {
            font-size: 24px;
            font-weight: bold;
            color: rgb(69, 69, 69);
            padding-bottom: 16px;
          }
    
          .buttons-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            gap: 8px;
          }
    
          .buttons-container button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background-color: #dc3545;
            color: #fff;
          }
    
          #replace-button {
            background-color: #2a8ffb;
            color: #fff;
            font-weight: bold;
          }
    
          #copy-button {
            background-color: #33dd5a;
            color: #fff;
            font-weight: bold;
          }
    
          #cancel-button {
            background-color: #e34353;
            color: #fff;
            font-weight: bold;
          }
        `;
  
      this.loadingSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><radialGradient id='a12' cx='.66' fx='.66' cy='.3125' fy='.3125' gradientTransform='scale(1.5)'><stop offset='0' stop-color='#000000'></stop><stop offset='.3' stop-color='#000000' stop-opacity='.9'></stop><stop offset='.6' stop-color='#000000' stop-opacity='.6'></stop><stop offset='.8' stop-color='#000000' stop-opacity='.3'></stop><stop offset='1' stop-color='#000000' stop-opacity='0'></stop></radialGradient><circle transform-origin='center' fill='none' stroke='url(#a12)' stroke-width='15' stroke-linecap='round' stroke-dasharray='200 1000' stroke-dashoffset='0' cx='100' cy='100' r='70'><animateTransform type='rotate' attributeName='transform' calcMode='spline' dur='2' values='360;0' keyTimes='0;1' keySplines='0 0 1 1' repeatCount='indefinite'></animateTransform></circle><circle transform-origin='center' fill='none' opacity='.2' stroke='#000000' stroke-width='15' stroke-linecap='round' cx='100' cy='100' r='70'></circle></svg>`;
    }
  
    initialize(_textResult) {
      // Create real DOM element
      this.modal = document.createElement("div");
      const style = document.createElement("style");
      style.textContent = this.modalCSS;
  
      // Create shadow DOM
      this.shadowRoot = this.modal.attachShadow({ mode: "open" });
  
      // Append HTML and CSS to shadow DOM
      this.shadowRoot.innerHTML = this.modalHTML;
      this.shadowRoot.appendChild(style);
  
      // Get modal elements
      this.modalContent = this.shadowRoot.querySelector(".modal-content");
      this.copyButton = this.shadowRoot.querySelector("#copy-button");
      this.cancelButton = this.shadowRoot.querySelector("#cancel-button");
  
      // Copy button functionality
      this.copyButton.onclick = () => {
        const textResult = _textResult || "";
        navigator.clipboard.writeText(textResult);
        this.hideModal();
      };
  
      // Cancel Button functionality
      this.cancelButton.onclick = () => this.hideModal();
  
      // Attach modal to the main DOM document body
      document.body.appendChild(this.modal);
    }
  
    showModal(content, textResult) {
      // Initialize the modal with creating shadow DOM
      this.initialize(textResult);
  
      // Parse markdown content setting options for code highlighting
      marked.setOptions({
        highlight: function (code, language) {
          const validLanguage = hljs.getLanguage(language)
            ? language
            : "plaintext";
          return hljs.highlight(code, { language: validLanguage }).value;
        },
      });
  
      // Set the modal content
      this.modalContent.innerHTML = marked.parse(content);
      // Show the modal
      this.shadowRoot.querySelector("#modal-overlay").style.display = "flex";
    }
  
    hideModal() {
      this.shadowRoot.querySelector("#modal-overlay").style.display = "none";
      this.modalContent.innerHTML = "";
      // Remove the modal from the DOM
      this.modal.remove();
    }
  
    showLoading() {
      if (document.getElementById("loading-indicator")) return;
  
      const loadingIndicator = document.createElement("div");
      Object.assign(loadingIndicator, {
        id: "loading-indicator",
        innerHTML: this.loadingSvg,
      });
  
      Object.assign(loadingIndicator.style, {
        position: "fixed",
        bottom: "10px",
        right: "10px",
        width: "50px",
        height: "50px",
        zIndex: "1000",
        borderRadius: "10px",
        padding: "8px",
        background: "whitesmoke",
      });
  
      document.body.appendChild(loadingIndicator);
    }
  
    hideLoading() {
      const loadingIndicator = document.getElementById("loading-indicator");
      if (loadingIndicator) {
        document.body.removeChild(loadingIndicator);
      }
    }
  }