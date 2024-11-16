import { LitElement, html, css } from "../libs/lit-all@2.7.6.js";
import globalCss from "../global-styles/global.css.mjs";
import { emailAndPasswordLogIn } from "../services/auth.mjs";

export default class LogIn extends LitElement {
  static properties = {
    email: { type: String, state: true },
    password: { type: String, state: true },
    query: { type: Object, state: true },
    errorMessage: { type: String, state: true },
  };

  /**
   * @param {Context} context
   */
  constructor(context) {
    super();
    this.email = "";
    this.password = "";
    /** @type {{ [key: string]: string}} */
    this.query = {};
    context.querystring.split("&").forEach((query) => {
      const [name, ...value] = query.split("=");
      this.query[name] = value.join("=");
    });
  }

  /**
   * Log in the user on form submission
   * @param {HTMLEvent} e
   */
  async logIn(e) {
    e.preventDefault();
    try {
      await emailAndPasswordLogIn(this.email, this.password);
      page(this.query.redirect ?? "/");
    } catch (e) {
      if (e instanceof Error) this.errorMessage = e.message;
      else this.errorMessage = String(e);
    }
  }

  render() {
    return html`
      <main>
        <form @submit=${this.logIn}>
          <label>
            Email
            <input
              type="text"
              @change=${(/** @type {HTMLInputEvent} */ e) =>
                (this.email = e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              @change=${(/** @type {HTMLInputEvent} */ e) =>
                (this.password = e.target.value)}
            />
          </label>
          <button class="button">Log In</button>
          ${this.errorMessage &&
          html`<p class="error-message">${this.errorMessage}</p>`}
          <p><a href="/forgot-password">Forgot your password?</a></p>
          <p>
            Don't have an account?
            <a href="/sign-up${location.search}">Sign up</a>
          </p>
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

      main form > * {
        display: block;
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

customElements.define("log-in", LogIn);
