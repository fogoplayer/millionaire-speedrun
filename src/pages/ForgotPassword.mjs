import { LitElement, html, css } from "../libs/lit-all@2.7.6.js";
import globalCss from "../global-styles/global.css.mjs";
import { sendPasswordResetEmail } from "../services/auth.mjs";

export default class ForgotPassword extends LitElement {
  static properties = {
    email: { type: String, state: true },
    message: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this.message = "";
    this.email = "";
  }

  /**
   * Send a forgot password email to the specified address
   * @param {HTMLEvent} e
   */
  async submitForgotPassword(e) {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(this.email);
      this.message =
        "Email sent. If it does not seem to arrive, check your spam folder before trying again";
    } catch (e) {
      if (e instanceof Error) this.message = e.message;
      else this.message = String(e);
    }
  }

  render() {
    return html`
      <main>
        <form @submit=${this.submitForgotPassword}>
          <p>
            Forgot your password? Put in the email associated with your account
            and we'll send you a reset link
          </p>
          <label>
            Email
            <input
              type="text"
              @change=${(/** @type {HTMLInputEvent} */ e) =>
                (this.email = e.target.value.trim())}
            />
          </label>
          <button class="button">Submit</button>
          <p class="error-message">${this.message}</p>
        </form>
      </main>
    `;
  }

  static styles = [
    globalCss,
    css`
      main {
        max-width: var(--limited-width);
        margin-inline: auto;
      }

      main form label input,
      main form button {
        display: inline-block;
        margin-block-end: 1em;
      }

      main form button {
        margin-inline: auto;
      }

      main form p {
        text-align: center;
      }

      .error-message {
        color: var(--red);
        margin-block-end: 1em;
      }
    `,
  ];
}

customElements.define("forgot-password", ForgotPassword);
